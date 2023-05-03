---
layout: base-layout.njk
---
## Инструкция развертывания локальной среды разработки для платформы Атомайз
### Рекомендации:
Для работа с песочницей вам понадобятся навыки работы с:
- [git](https://githowto.com/ru)
- [docker](https://docs.docker.com/)
- [Hyperledger Fabric](https://hyperledger-fabric.readthedocs.io/en/release-2.4/)

Также на компьютере должны быть установлены:
- git
- docker
- docker-compose

## Развертывание платформы версии HLF 2.4 и ордерингом на базе smartBFT.
Требуется выполнить следующие шаги:

### 1. Скачиваем скрипты и артифакты для развертывания

Скачиваем песочницу:
```
git clone ssh://git@gitlab.project-karma.com:2224/atomyze/library/test/sandbox.git
```
![sb1](/doc/uploads/sb1.png)

Скачиваем заготовки системных чейнкодов:
```
git clone ssh://git@gitlab.project-karma.com:2224/atomyze/library/test/dummy-cc.git
```
![sb2](/doc/uploads/sb2.png)


Логинимся в реджестки для выкачивания образов:
```
docker login registry.project-karma.com -u student
passwd: SBZeAj7gv7RZze2sks_U
```

### 2. Подготовка к развертыванию песочницы
Переносим чейнкоды которые были скачаны шагом выше в соответствующую директорию для установки:
```
cp -r ./dummy-cc/public/* ./sandbox/atomyze-bft-2.4-devel/tool/data/channel/public/
```
и переходим в директорию песочницы которая соответствует окружению:
```
cd ./sandbox/atomyze-bft-2.4-devel
```
### 3. Запуск песочницы.
Запускаем:
```
. ./env-hlf-2.4.7 && docker-compose up --detach
```
После выполнения команды мы увидим процесс создания песочницы, нас интересуют только статусы “Started”

![sb3](/doc/uploads/sb3.png)

отследить окончание процесса запуска мы можем следующей командой:
```
docker-compose logs tool | grep "consistent state"
```
![sb4](/doc/uploads/sb4.png)

Если увидели этот вывод, значит сеть запустилась.

### 4. Удаление песочницы
Для полного удаления песочницы:
```
docker-compose down -v
```
### 5. Запросы к чейнкоду
Для дополнительной проверки можно сделать запрос query к чейнкоду.
Например обращение к чейнкоду fiat и получение его metadata:
```
docker-compose exec tool query public fiat fiat '{"Function":"metadata", "Args":[""]}'
```
![sb5](/doc/uploads/sb5.png)
Результат получаем в формате JSON.
