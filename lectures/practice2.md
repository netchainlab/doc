---
layout: base-layout.njk
---
INPROGRESS

# Простые операция над fiat токеном


# Взаимодействие с observer
Observer - внешний по отношению к HLF сервис, индексирующий историческую информацию леджера - то что поступает в лог. Создан на модульной основе, каждый модуль или layer индексирует свой уровень информации от общего к частному. Layer 1 или L1 - индексирует базовые  сущности - блоки и транзакции доступен по адресу http://51.250.110.24:9010/ или на локальном хосте по порту 9010 для локально установленного сендбокса. Layer 2 или L2 индексирует базовые сущности атомайз, такие как преимаджи, батчи, межканальные свопы. Доступен по адресу http://51.250.110.24:9020/  или на локальном хосте по порту 9020 для локально установленного сендбокса.
Сервис работает на основе graphQL - https://graphql.org/

## Список каналов
http://51.250.110.24:9010/
```
query{
  channels{
    name
    countBlocks
  }
}
```


```
{
	"info": {
		"_postman_id": "9504a8de-97ca-4310-8262-129d70c04e8e",
		"name": "test",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
		"_exporter_id": "6728230",
		"_collection_link": "https://crimson-shadow-50398.postman.co/workspace/anoidea~f341bc34-e7ce-40ed-906e-75555e4c9acf/collection/6728230-9504a8de-97ca-4310-8262-129d70c04e8e?action=share&creator=6728230&source=collection_link"
	},
	"item": [
		{
			"name": "acl create user u1",
			"protocolProfileBehavior": {
				"followAuthorizationHeader": true
			},
			"request": {
				"auth": {
					"type": "noauth"
				},
				"method": "POST",
				"header": [
					{
						"key": "Authorization",
						"value": "Bearer test",
						"type": "text"
					}
				],
				"body": {
					"mode": "raw",
					"raw": "{\n  \"args\": [\n    \"RUtERlg2MW15SHRoVkxVNnE2VHlLakQ0QVQzeERYYzVjSkZEOGREZzJKWlk=\",\n    \"dGVzdA==\",\n    \"dTE=\",\n    \"dHJ1ZQo=\"\n  ],\n    \"channel\":\"acl\",\n    \"chaincodeId\":\"acl\",\n    \"fcn\":\"addUser\"\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "51.250.110.24:9001/invoke",
					"host": [
						"51",
						"250",
						"110",
						"24"
					],
					"port": "9001",
					"path": [
						"invoke"
					]
				}
			},
			"response": []
		},
		{
			"name": "acl create user u2",
			"protocolProfileBehavior": {
				"followAuthorizationHeader": true
			},
			"request": {
				"auth": {
					"type": "noauth"
				},
				"method": "POST",
				"header": [
					{
						"key": "Authorization",
						"value": "Bearer test",
						"type": "text"
					}
				],
				"body": {
					"mode": "raw",
					"raw": "{\n  \"args\": [\n    \"NGNqa2J2dGNBQllwd290UnBlMWVUN1RhelIzQkdrcTZSN2NGRkRnRjVlNGk=\",\n    \"dGVzdA==\",\n    \"dTI=\",\n    \"dHJ1ZQo=\"\n  ],\n    \"channel\":\"acl\",\n    \"chaincodeId\":\"acl\",\n    \"fcn\":\"addUser\"\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "51.250.110.24:9001/invoke",
					"host": [
						"51",
						"250",
						"110",
						"24"
					],
					"port": "9001",
					"path": [
						"invoke"
					]
				}
			},
			"response": []
		},
		{
			"name": "fiat emition u1 100",
			"protocolProfileBehavior": {
				"followAuthorizationHeader": true
			},
			"request": {
				"auth": {
					"type": "noauth"
				},
				"method": "POST",
				"header": [
					{
						"key": "Authorization",
						"value": "Bearer test",
						"type": "text"
					}
				],
				"body": {
					"mode": "raw",
					"raw": "{\n  \"args\": [\n    \"Qko3RndGRnN1TjkxS29IRXZyY2ozdGRxRFl0VFZSZHhzQ1l2ckhrSFVmWDJSS0ZGTg==\",\n    \"MTAw\"\n  ],\n    \"channel\":\"fiat\",\n    \"chaincodeId\":\"fiat\",\n    \"fcn\":\"emit\"\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "51.250.110.24:9001/invoke",
					"host": [
						"51",
						"250",
						"110",
						"24"
					],
					"port": "9001",
					"path": [
						"invoke"
					]
				}
			},
			"response": []
		},
		{
			"name": "observer get",
			"request": {
				"method": "GET",
				"header": []
			},
			"response": []
		}
	]
}
```
