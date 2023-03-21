---
layout: base-layout.njk
---
# ACL
Функции системного чейнкода ACL.

## init - инициализация смартконтракта
**args:** adminSKI, validatorsCount, validator1, validator2, validator3
- **adminSKI** string в формате hex.EncodeToString - в нашей системе это ski от приватного ключа crypto/peerOrganizations/atomyze/users/Admin@atomyze/msp/keystore/fd4b1c0c2bbef8fc73ec489d44ced8f57742a6036601b8d73ed0328e6741d7ca_sk
- **validatorsCount** int - кол-во валидаторов которые должны обязательно подтвердить транзакцию. кол-во публичных ключей, которое будет передано в параметре validators
- **validators** - список публичных ключей (алгоритм ed25519) валидаторов в формате base58, который будет использоваться для проверки подписи при выполнении функций в ACL, например при изменении публичного ключа changePublicKey

После инициализации данные хранятся в стейте по ключу "__init" (по этой причине нельзя запускать пир с бд couchdb)

### Алгоритм подписи валидаторами
 #### 1. Создание message
```go
func GenerateMessage(validatorPublicKeys []string, methodName string, args []string) string {
    nonce := strconv.FormatInt(nowMillisecond(), 10)
    result := []string{methodName}
    result = append(result, args...)
    result = append(result, nonce)
    for _, publicKey := range validatorPublicKeys {
        result = append(result, publicKey)
    }
    return strings.Join(result, "\n")
}
```
 #### 2. Подпись валидатором
```go
func SignMessage(signerInfo SignerInfo, result []string) ([]byte, [32]byte, error) {
message := sha3.Sum256([]byte(strings.Join(result, "")))
sig := ed25519.Sign(signerInfo.PrivateKey, message[:])
if !ed25519.Verify(signerInfo.PublicKey, message[:], sig) {
err := fmt.Errorf("valid signature rejected")
log.Error("ed25519.Verify", zap.Error(err))
return nil, message, err
}
return sig, message, nil
}
```
Описание общего процесса подписи и формата hex/base58 подписи

```go
// сообщение созданное на шаге 1
var message
result := strings.Split(message, "\n")
signatureBytes, _, err := service.SignMessage(signerInfo, result)
if err != nil {
log.FError("Error SignMessage", err)
panic(err)
return
}
// в зависимости от метода нужно выбрать в каком формате хранятся подписи
//signature := hex.EncodeToString(signatureBytes)
signature := base58.Encode(signatureBytes)
```
#### 3 Отправка запроса в блокчейн
```go
// сообщение созданное на шаге 1
var message
// набор подписей валидаторов созданный на шаге 2
var signatures
var result []string
for _, s := range strings.Split(message, "\n") {
result = append(result, s)
}
messageWithSig := append(result[1:], signatures...)
```
Все методы возвращают Response
Далее в секции out будет описываться только то, что лежит в Payload поле peer.Response.

## addUser
Создание кошелька пользователя
**аргументы:** pk, kycHash, userId, isIndustrial
- **pk** - публичный ключ пользователя в кодировке base58
- **kycHash** - KYC хеш, некоторая информация которая идентифицирет пользователя на стороне клиента, для тестов можно использовать любой стринг
- **userId** - ID юзера
- **isIndustrial** - “true” или “false”

**out**: ---

## addMultisig
Создание мультисиг-кошелька
**аргументы:** N, nonce, ...pubkeys, ...signatures
- **N** - достаточное количество подписей из общего числа подписей
- **nonce** - нонс в миллисекундах
- **...pubkeys** - публичные ключи участников кошелька
- **..signatures** - подписи участников кошелька

**out**: ---

## addToList
Помещение адреса в грейлист/блэклист
**аргументы**: address, type
- **address** - адрес в кодировке base58 check
- **type** - “black” или “gray”

**out**: ---

## delFromList
Удаление адреса из грейлист/блэклист
**аргументы**: address, type
- **address** - адрес в кодировке base58 check
- **type** - “black” или “gray”

**out**: ---

## checkKeys
Проверка находится ли адрес, связанный с этими ключами, в грей/
блэклисте
**аргументы**: pubkeys
- **pubkeys** - строка из конкатенированных публичных ключей (с сепаратором “/”) в кодировке base58

**out**:
```
message AclResponse {
    AccountInfo account     = 1;
    SignedAddress address   = 2;
}
```
## checkAddress
Позволяет проверить, находится ли конкретный адрес в грейлисте
**аргументы**: address
- **address** - адрес в кодировке base58 check

**out**:
```
message Address {
    string userID                     = 1;
    bytes address                     = 2;
    bool isIndustrial                 = 3;
    bool isMultisig                   = 4;
}
```
## сhangePublicKey
Замена публичного ключа для адреса
**Аргументы**: address, reason, reasonId, newkey, nonce, ...pubkeys, ...signatures
- **address** - адрес в кодировке base58 check (адрес для которого меняется публичный ключ)
- **reason** - причина изменения ключа, строка
- **reasonId** - строка
- **newkey** - новый публичный ключ для указанного адреса (параметр address) в кодировке base58
- **nonce** - нонс в миллисекундах
- **...pubkeys** - публичные ключи валидаторов, каждый ключ в формате base58
- **..signatures** - подписи валидаторов, каждая подпись в формате hex

**out**: ---

## changePublicKeyWithBase58Signature
**ВНИМАНИЕ!!! Для этого метода подпись работает как в foundation
**
Замена публичного ключа для адреса
**аргументы**: address, reason, reasonId, newkey, nonce, ...pubkeys, ...signatures
- **address** - адрес в кодировке base58 check (адрес для которого меняется публичный ключ)
- **reason** - причина изменения ключа, строка
- **reasonId** - строка
- **newkey** - новый публичный ключ для указанного адреса (параметр address) в кодировке base58
- **nonce** - нонс в миллисекундах
- **...pubkeys** - публичные ключи валидаторов, каждый ключ в формате base58
- **..signatures** - подписи валидаторов, каждая подпись в формате base58

**out**: ---

## changeMultisigPublicKey
Замена публичного ключа в мультисиге
**аргументы**: address, oldkey, newkey, reason, reasonId, nonce, ...pubkeys, ...signatures
- **address** - адрес в кодировке base58 check
- **oldkey** - старый публичный ключ в кодировке base58
- **newkey** - новый публичный ключ в кодировке base58
- **reason** - причина изменения ключа, строка
- **reasonId** - строка
- **nonce** - нонс в миллисекундах
- **...pubkeys** - публичные ключи валидаторов
- **..signatures** - подписи валидаторов

**out**: ---

## getAccountInfo
Получение информации об аккаунте (KYC хеш, признаки graylist, blacklist)
**аргументы**: address
- **address** - адрес в кодировке base58 check

**out**: JSON-serialized
```
message AccountInfo {
    string kycHash      = 1;
    bool grayListed     = 2;
    bool blackListed    = 3;
}
```

## getAddresses
Список зарегистрированных адресов.
**аргументы**: pageSize bookmark
- **pageSize** -
- **bookmark** -
out: JSON-serialized
```
AddrsWithPagination
```

## setAccountInfo
Установка account info для адреса (KYC хеш, признаки graylist, blacklist)
**аргументы**: address, KYChash, isGraylisted, isBlacklisted
- **address** - адрес в кодировке base58 check
- **KYChash** - KYC хеш
- **isGraylisted** - “true” или “false”
- **isBlacklisted** - “true” или “false”

**out**: ---

## setkyc
Обновление KYC хеша для определенного аккаунта по адресу
**аргументы**: address, KYChash, nonce, ...pubkeys, ...signatures
- **address** - адрес в кодировке base58 check
- **KYChash** - KYC хеш, строка
- **nonce** - нонс в миллисекундах
- **...pubkeys** - публичные ключи валидаторов
- **..signatures** - подписи валидаторов

**out**: ---
