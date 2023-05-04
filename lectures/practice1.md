---
layout: base-layout.njk
---

# Регистрация новых пользователей в Атомайз
## Создание пользовательского адреса и криптоматериалов
В контексте данной статьи, пользователь - это название роли, за которую выступает физлицо, взаимодействующее с системой атомайз посредством транзакций.
Авторизация пользовательской активности в системе атомайз производится через подпись пакета транзакции ключом ed25519. Таким образом, пользователь должен сгенерить свою пару ключей и адрес.
### 1. Создание пары пользовательской ключей ed25519 с помощью утилиты cli.
cli - утилита для вспомогательных операций, находится по адресу https://gitlab.project-karma.com/atomyze/cli

TODO восстановить в репозитории.

TODO закинуть cli --help

#### 1.1 Генерация приватного ключа:
```
./cli privkey
```
TODO - вставить скриншот результата работы
#### 1.2 Генерация публичного ключа из приватного
Создается из приватного ключа, полученного на предыдущем этапе.
```
./cli pubkey -s <privkey>
```
TODO - вставить скриншот результата работы

#### 1.3 Создание уникального адреса пользователя.
Адрес пользователя в системе атомайз ***изначально*** генерится на основании уникального публичного ключа.
```
./cli address -s <privkey>
```
### 2. Создание пары пользовательских ключей ed25519 с помощью bash и openssl
Стандартная утилита openssl может быть использована для генерации криптоматериалов пользователя. Openssl кодирует криптоматериалы в формате PKCS и может записать их в формате base64 (-outform PEM) или бинарном RAW (-outform DER), таким образом приватный ключ имеет размер 48 байт, публичный 44 байта. Такой формат может быть не удобен для использования в  библиотеках, реализующих алгоритмы ed25519, где приватный ключ записан как 64 байта, бубличный -32 байта.

#### 2.1 генерация приватного ключа
'''
openssl genpkey -algorithm ed25519 -outform PEM -out test25519.pem
cat test25519.pem
-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIDKw+yBtFnM796bBvjIVgMacvR1jGh+4d/Phwcnd2vD/
-----END PRIVATE KEY-----
'''
### 2.2 генерация публичного ключа из приватного
```
openssl pkey -in ed25519key.pem -pubout
-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEATCjiep6jcLx/AaV8CaNpE9/KfMFhPKCWr+RxMFWye1A=
-----END PUBLIC KEY-----
```
### 2.3 Получение 32-х байтного публичного ключа
```
openssl pkey -in "$1" -pubout -outform DER | \  # параметр - имя файла с приватным PKCS ключом, получаем публичный PKCS в бинарном виде
    dd ibs="12" skip=1 | \                      # отделяем заголовок 12 байт, получаем публичную часть ключа 32 байта
    base58 -c                                   # кодируем в base58check
```
Пример:
```
openssl pkey -in test25519.pem -pubout -outform DER | dd ibs="12" skip=1 | base58 -c
2+1 records in
0+1 records out
32 bytes copied, 0,0102328 s, 3,1 kB/s
rHndwUtJwHRGKxEQG4A4WzPYGcLqDKUiCrN87bzNidkQBBpbz
```

### 2.4 Получение 64-х байтного приватного ключа
```
openssl pkey -in "$1" -outform DER | \  # параметр - имя файла с приватным PKCS ключом, получаем публичный PKCS в бинарном виде
    dd ibs="14" skip=1 | \                      # отделяем заголовок 14 байт, получаем публичную часть ключа 32 байта
    base58 -c                                   # кодируем в base58check
```
Пример:
```
openssl pkey -in test25519.pem -outform DER | dd ibs="14" skip=1 | base58 -c
2+1 records in
0+1 records out
34 bytes copied, 0,00975185 s, 3,5 kB/s
cPuyzxT7Wp1B7vB83bu51nYNEKP8UoW9Bsa4yGACGyV7vE3QziE
```
TODO склейка в баш

Результат, приватный ключ в формате 64 байта:
```
cPuyzxT7Wp1B7vB83bu51nYNEKP8UoW9Bsa4yGACGyV7vE3QziErHndwUtJwHRGKxEQG4A4WzPYGcLqDKUiCrN87bzNidkQBBpbz
```

### 2.5 получение адреса
```
openssl pkey -in "$1" -pubout -outform DER | \  # параметр - имя файла с приватным PKCS ключом, получаем публичный PKCS в бинарном виде
    dd ibs="12" skip=1 | \                      # отделяем заголовок 12 байт, получаем публичную часть ключа 32 байта
    openssl dgst -sha3-256 -binary | \          # берем хеш от публичного ключа
    base58 -c                                   # кодируем в base58check
```
Пример:
```
openssl pkey -in test25519.pem -pubout -outform DER | dd ibs="12" skip=1 |openssl dgst -sha3-256 -binary | base58 -c
2+1 records in
0+1 records out
32 bytes copied, 0,0189481 s, 1,7 kB/s
2ePfBX5Lk387pa1n1uQWVQJbjCvZQTyhKJFx91HVu3h475GAaZ
```
## Регистрация пользователя в системе атомайз
"Администратор" получает команду на регистрацию нового пользователя. В песочнице роль администратора исполняют сами разработчики ПО. Регистрация производится через вызов ***административной*** функции чейнкода ACL ***addUser***.

### 1. Полученные данные от пользователей:
Пусть администратор получил следующие данные на регистрацию двух пользователей:
```
User1
priv: MDUhrMo99dyddGZ8DWNvyHgDZgSUQfYwpxxC3rn51bXxeXRop2KonGTtsbs8xEx6RKrMFDFjDppbAHW9n94cNzX18A7Be
pub: EKDFX61myHthVLU6q6TyKjD4AT3xDXc5cJFD8dDg2JZY
address: BJ7FwFFsuN91KoHEvrcj3tdqDYtTVRdxsCYvrHkHUfX2RKFFN

User2
priv: G3EXhYTAsj1bgL8wYzVRu4w4gc6DJKaLCdFQBRkATS5UGtLkVRuh2SfsbJ5uPpo3rs13hRAMk1zYhW38dhxoatqTyoTZg
pub: 4cjkbvtcABYpwotRpe1eT7TazR3BGkq6R7cFFDgF5e4i
address: 29oZAgtgNziLHJS7L4bsoSsHXMYXBFufH77HDyxLsGrJaPrud4
```

### 2.Вызов addUser
Взаимодействие с системой производим посредством сервиса hlf-proxy (https://gitlab.project-karma.com/atomyze/library/hlf-tool/hlf-proxy). HLF-proxy является частью стандартной поставки песочницы. Позволяет отправлять запросы query и invoke в систему атомайз на любой установленный чейнкод. Принимает запросы в формате REST.
Документация, ссылка на swagger hlf-proxy http://51.250.110.24:9001/docs
Параметры addUser:
```
pk - публичный ключ пользователя в кодировке base58
kycHash - KYC хеш, не участвует в логике ACL. Для тестов можно использовать любой стринг.
userId - связанный с пользователем идентификатор, не участвует в логике ACL. Для тестов можно использовать любой стринг.
isIndustrial - флаг “true” или “false”
```
В таком случае у нас получается:

Параметры для первого пользователя:
```
    "EKDFX61myHthVLU6q6TyKjD4AT3xDXc5cJFD8dDg2JZY",
    "test",
    "u1",
    "true"
```

Параметры для второго пользователя:
```
    "4cjkbvtcABYpwotRpe1eT7TazR3BGkq6R7cFFDgF5e4i",
    "test",
    "u1",
    "true"
```

Сервис hlf-proxy принимает аргументы вызываемой функции в формате base64, кодируем и приступаем к вызову функции регистрации пользователей.

#### Создание U1
```
curl --location '51.250.110.24:9001/invoke' \
--header 'Authorization: Bearer test' \
--header 'Content-Type: application/json' \
--data '{
  "args": [
    "RUtERlg2MW15SHRoVkxVNnE2VHlLakQ0QVQzeERYYzVjSkZEOGREZzJKWlk=",
    "dGVzdA==",
    "dTE=",
    "dHJ1ZQo="
  ],
    "channel":"acl",
    "chaincodeId":"acl",
    "fcn":"addUser"
}'
```

результат:

```
{
    "blockNumber": 9,
    "chaincodeStatus": 200,
    "transactionId": "298f6a4434de01cfd5c830e22906b6511379990622f36294cec4fe43d9d2cb79"
}
```

##### create U2
```
curl --location '51.250.110.24:9001/invoke' \
--header 'Authorization: Bearer test' \
--header 'Content-Type: application/json' \
--data '{
  "args": [
    "NGNqa2J2dGNBQllwd290UnBlMWVUN1RhelIzQkdrcTZSN2NGRkRnRjVlNGk=",
    "dGVzdA==",
    "dTI=",
    "dHJ1ZQo="
  ],
    "channel":"acl",
    "chaincodeId":"acl",
    "fcn":"addUser"
}'
```

Результат:
```
{
    "blockNumber": 10,
    "chaincodeStatus": 200,
    "transactionId": "27d740819e346e6d492584113483d00a382d98cdfa6ef20c0de05c9abb725f16"
}
```
