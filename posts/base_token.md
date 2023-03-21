---
layout: base-layout.njk
---

# Base Token - базовый токен.

## BuyToken - покупка токена.
Сигнатура метода:
```go
TxBuyToken(sender types.Sender, amount *big.Int, currency string) error

```
Подписывается пользователем. При подписи эмитентом возвращается ошибка. В рамках работы метода проверяются рейсы и лимиты, поэтому они должны быть заданы заранее.

Пример из теста:
```go
issuer.SignedInvoke("vt", "setRate", "buyToken", "usd", "100000000")
issuer.SignedInvoke("vt", "setLimits", "buyToken", "usd", "1", "10")
```
## BuyBack - обратный выкуп токена.
Сигнатура метода:
```go
TxBuyBack(sender types.Sender, amount *big.Int, currency string) error

```
Подписывается пользователем. При подписи эмитентом возвращается ошибка. Аналогично предыдущему методу, производится проверка рейтов и лимитов.

Пример из теста:
```go
issuer.SignedInvoke("vt", "setRate", "buyBack", "usd", "100000000")
issuer.SignedInvoke("vt", "setLimits", "buyBack", "usd", "1", «10")

```
## Metadata - запрос метадаты токена.
Сигнатура метода:
```go
QueryMetadata() (metadata, error)

```
Дополнительные условий не требуется.

## BalanceOf - запрос баланса.
Сигнатура метода:
```go
QueryBalanceOf(address types.Address) (*big.Int, error)

```
Дополнительных условий не требуется.

## AllowedBalanceOf - запрос allowed баланса.
Сигнатура метода:
```go
QueryAllowedBalanceOf(address types.Address, token string)

```
Дополнительных условий не требуется.

## DocumentsList - запрос документов, прикреплённых к токену.
Сигнатура метода:
```go
QueryDocumentsList() ([]core.Doc, error)

```
Дополнительных условий не требуется.

## AddDocs - добавление документов к токену.
Подписывается эмитентом.
Сигнатура метода:
```go
TxAddDocs(sender types.Sender, rawDocs string) error
```
## DeleteDoc - удаление документа.
Сигнатура метода:
```go
TxDeleteDoc(sender types.Sender, docID string) error

```
Подписывается эмитентом.

## SetRate - установка рейта.
Сигнатура метода:
```go
TxSetRate(sender types.Sender, dealType string, currency string, rate *big.Int) error

```
Подписывается эмитентом.

## SetLimits - установка лимита.
Сигнатура метода:
```go
TxSetLimits(sender types.Sender, dealType string, currency string, min *big.Int, max *big.Int) error

```
Подписывается эмитентом.

## Transfer - передача токенов на указанный адрес.
Сигнатура метода:
```go
TxTransfer(sender types.Sender, to types.Address, amount *big.Int, ref string) error

```
Количество передаваемых токенов не должно быть нулевым, токены нельзя переслать самому себе, если установлена комиссия и комиссионная валюта не пустая, то с отправителя будет списана комиссия.

## PredictFee - расчёт комиссии.
Сигнатура метода:
```go
QueryPredictFee(amount *big.Int) (predict, error)

```
Дополнительных условий не требуется.

## SetFee - установка комиссии.
Сигнатура метода:
```go
TxSetFee(sender types.Sender, currency string, fee *big.Int, floor *big.Int, cap *big.Int) error

```
Подписывается FeeSetter’ом.
Производится проверка на значение комиссии - она должна быть не более 100%, также
производится проверка на значения лимитов floor и cap.

## SetFeeAddress - установка комиссионного адреса.
Сигнатура метода:
```go
TxSetFeeAddress(sender types.Sender, address types.Address) error

```
Подписывется FeeAddressSetter’ом.

## SwapBegin - начало процесса атомарного свопа.
Сигнатура метода:
```go
TxSwapBegin(sender types.Sender, token string, contractTo string, amount *big.Int, hash types.Hex) (string, error)

```
Дополнительных условий не требуется.

## SwapCancel - сброс свопа.
Сигнатура метода:
```go
TxSwapCancel(sender types.Sender, swapID string) error

```
Дополнительных условий не требуется.

## SwapGet - информация по свопу.
Сигнатура метода:
```go
QuerySwapGet(swapID string) (*proto.Swap, error)

```
Дополнительных условий не требуется.

## swapDone - завершение свопа пользователем.
Здесь вызывается локальный метод контракта swapUserDone.
Сигнатура метода:
```go
swapUserDone(bc BaseContractInterface, swapID string, key string) peer.Response

```
Дополнительных условий не требуется.

## deleteRate - удалить рейт
Подписывается эмитентом
Аргументы: dealType, currency

1. dealType - тип сделки
пример: "название типа сделки - создается методом setRate"
2.  currency - валюта
пример: "BA"

Сигнатура метода:
```go
TxDeleteRate(sender types.Sender, dealType string, currency string)

```

## allowedIndustrialBalanceTransfer - перевод средств
подписывается отправителем средств
Аргументы: toAddress assets reason
1. toAddress - адрес куда будут переведены средства
2. assets - список переводимых валют и их кол-во
пример '{"Assets":[{"group":"BA02_A1goldbar.1","amount":"1"},
{"group":"BA02_B1silverbar.1","amount":"1"}]}'
3. reason - причина
Пример запроса:

```go
allowedIndustrialBalanceTransfer $toAddress '{"Assets":[{"group":"BA02_A1goldbar.1","amount":"1"},{"group":"BA02_B1silverbar.1","amount":"1"}]}' 'ref'
```
Сигнатура метода:
```go
TxAllowedGroupBalanceTransfer(sender types.Sender, to types.Address, rawAssets string, ref string)
```
