---
title: "Разворачиваем свой MQTT сервер на Raspberry Pi"
date: "2025-03-26"
---

# Разворачиваем свой MQTT сервер на Raspberry Pi

2025-03-26

![raspberry](/images/raspberry.png)

## Содержание

- [Разворачиваем свой MQTT сервер на Raspberry Pi](#разворачиваем-свой-mqtt-сервер-на-raspberry-pi)
  - [Содержание](#содержание)
  - [Введение](#введение)
  - [Настройка Raspberry](#настройка-raspberry)

Доброго времени суток! Продолжаем строить свою домашнюю систему автоматизации на базе Raspberry Pi. В этой статье я поделюсь опытом создания своего MQTT сервера на базе Raspberry Pi.

## Введение

Ввиду своей природной лени и некой территориальной недоступности оконных рулонных штор (окно расположено за диваном и лазить туда неудобно), было разработано некое "умное" устройство, на базе ESP32, для решения задачи автомтического подъема/опускания штор по расписанию, а именно по времени восхода и заката. Назовем это устройство, например штороподъемником. Подробнее, про процесс разоаботки штороподъемниа я планирую написать отдельно, а целью этой статьи является некое конспектирование процесса разворачивания собственного MQTT брокера. Для чего нужен MQTT брокер? В моем случае, для обмена данными между штороподъемником и приложениями, позволяющими контролировать его состояние и вручную управлять процессами открывания-закрывания. MQTT брокер позволяет достаточно удобно и оперативно обмениваться короткими сообщениями между устройством и веб-сервисам. В моем случае, в качестве веб-сервисов выступают самописные приложения для Android и телеграм бот.

Кратко о принципах функционирования MQTT. Это как уже было сказано, легковесный протокол обмена сообщениями, специально разработанный для IoT устройств с ограниченными ресурсами и сетей с низкой пропускной способностью. Он использует модель издатель-подписчик, где клиенты (устройства или приложения) взаимодействуют через центральный сервер - брокер. Устройства, использующие MQTT принимают информацию путем "подписки" на определенную группу сообщений, которую веб-сервисы "публикуют" через брокера, и наоборот, веб сервисы "подписаны" на сообщения, "публикуемые" устройствами. Вот картинка, иллюстрирующая принцип обмена сообщения "публикация (publish)"-"подписка (subscribe)"

![mqtt](/images/mqtt-publish-subscribe.png)

Для удобства, сообщения группируются по темам (topics) и совершенно необязательно подписываться на все сообщения от устройства, или наоборот публиковать всю информацию об устройстве, достаточно опубликовать например, только топик содержащий текущее положение шторы, и веб-сервис, подписанный на этот топик получит только нужную информацию. Данный подход позволяет минимизировать количество сообщений, передаваемых между устройствами и веб-сервисами.

Я не хочу сильно углубляться в тонкости функционирования протокола, для этого в сети есть достаточно много толковых статей, например **[эта](https://habr.com/ru/articles/463669/)** или цикл статей от многоуважаемого **[kotyara12](https://kotyara12.ru/category/iot/interfaces/mqtt/)**. Как я уже упоминал выше, моей целью было разворачивание собственного брокера на Raspberry, на которой у меня уже крутится свой **[веб-сервер](http://code-core.ru/)**, FTP-сервер, медиа-сервер для домашнего пользования, ну и плюс внутрисетевая файлопомойка с торрент-качалкой.

В сети существует достаточно много MQTT брокеров, как платных, так и бесплатных. Наиболее распростаненным и популярным, на мой субъективный взгляд, является [Eclipse Mosquitto](https://mosquitto.org/) - брокер сообщений с открытым исходным кодом (лицензия EPL/EDL), реализующий протокол MQTT версий 5.0, 3.1.1 и 3.1.

![raspberry](/images/mosquitto.png)

**Mosquitto** — легкий и подходит для использования на всех устройствах от маломощных одноплатных компьютеров до полноценных серверов. **Mosquitto** является частью **Eclipse Foundation** и проектом **[iot.eclipse.org](https://iot.eclipse.org/)**. Он позволяет не только очень быстро развернуть свой экземмпляр брокера, но и предоставляет платформу для тестирования по адресу [test.mosquitto.org](https://test.mosquitto.org/), на которой можно быстро тестировать своих клиентов различными способами: простой MQTT, MQTT через TLS, MQTT через TLS (с клиентским сертификатом), MQTT через WebSockets и MQTT через WebSockets с TLS.

- Простой **MQTT** работает на порту 1883 без шифрования, т.е. все данные передаются в открытом виде. Подходит для использования в изолированных локальных сетях.
- Если планируется использование MQTT в сети интернет с пробросом локальных портов наружу, то рекомендуется использование **MQTT через TLS**. В данном случае используется порт по умолчанию 8883 и протокол шифрования TLS. Для работы MQTT в данном режиме необходимо будет либо создать самоподписанный сертификат, либо использовать клиентский сертификат, полученный от сертификатного центра СА. При работе в данном режиме для авторизации клиента, вместо логина/пароля используется сертификат.
- **MQTT через WebSocket** обычно работает через порт 9001 и предназначен для использования совместно браузерами и веб приложениями.
- Более защищенная версия **MQTT через WebSocket с TLS** работает через порт 9443 и дополнительно использует протокол шифрования TLS.

При настройке нашего сервера мы будем использовать подключения с TLS, но и самый простой вариант открытого MQTT через порт 1883 тоже предусмотрим.

## Настройка Raspberry

1. Устанавливаем на Raspberry Mosquitto с WebSockets:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install mosquitto mosquitto-clients libwebsockets-dev -y
```

2. Генерация SSL-сертификатов. Создадим самоподписанные сертификаты для TLS (для продакшена используйте Let's Encrypt):

- Создадим папку для сертификатов:

```bash
sudo mkdir -p /etc/mosquitto/certs
cd /etc/mosquitto/certs
```

- Создаем CA (Certificate Authority):

```bash
sudo openssl req -new -x509 -days 3650 -nodes -keyout ca.key -out ca.crt -subj "/CN=MQTT CA"
```

- Создаем сертификат сервера:

```bash
## Генерация ключа (без пароля)
sudo openssl genrsa -out server.key 2048

# CSR (Certificate Signing Request)
sudo openssl req -new -key server.key -out server.csr -subj "/CN=raspberrypi.local"

# Подписываем сертификат CA
sudo openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 365
```

**Важно** - вместо raspberry.local введите домен или IP адрес вашей Raspberry

- Настроим необхходимые права доступа к файлам сертификатов:

```bash
sudo chown -R mosquitto:mosquitto /etc/mosquitto/certs
sudo chmod 600 /etc/mosquitto/certs/*
```

- Просмотреть содержимое папки сертификатов можно командой:

```bash
ls -la /etc/mosquitto/certs
```

В ответе мы должны увидеть примерно следующее:

```bash
total 36
drwxr-xr-x 2 mosquitto mosquitto 4096 Mar 26 15:09 .
drwxr-xr-x 5 root      root      4096 Mar 26 15:14 ..
-rw------- 1 mosquitto mosquitto 1107 Mar 26 15:15 ca.crt
-rw------- 1 mosquitto mosquitto 1704 Mar 26 15:15 ca.key
-rw------- 1 mosquitto mosquitto   41 Mar 26 15:16 ca.srl
-rw------- 1 mosquitto mosquitto  130 Sep 30  2023 README
-rw------- 1 mosquitto mosquitto 1001 Mar 26 15:16 server.crt
-rw------- 1 mosquitto mosquitto  903 Mar 26 15:16 server.csr
-rw------- 1 mosquitto mosquitto 1704 Mar 26 15:16 server.key
```

Структура файлов следующая

**.crt** — сертификат в формате PEM;
**.key** — приватный ключ;
**.csr** — запрос на подпись сертификата.

- Для просмотра CA сертификата **ca.crt**:

```bash
sudo openssl x509 -text -noout -in /etc/mosquitto/certs/ca.crt
```

В ответе мы должны увидеть cрок действия, имя издателя (Issuer), публичный ключ, подпись алгоритма.

```bash
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number:
            0b:46:95:97:7d:08:bb:68:15:46:87:2b:17:e2:2e:0f:35:96:3b:a3
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: CN = MQTT CA
        Validity
            Not Before: Mar 26 12:15:50 2025 GMT
            Not After : Mar 24 12:15:50 2035 GMT
        Subject: CN = MQTT CA
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                Public-Key: (2048 bit)
                Modulus:
                    00:c4:e2:96:95:e6:9c:5f:64:71:9a:87:0d:53:f0:
                    # ...
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Subject Key Identifier:
                16:F3:89:10:6E:95:56:61:22:0F:D8:13:7F:63:BE:E4:9E:4C:F5:B3
            X509v3 Authority Key Identifier:
                16:F3:89:10:6E:95:56:61:22:0F:D8:13:7F:63:BE:E4:9E:4C:F5:B3
            X509v3 Basic Constraints: critical
                CA:TRUE
    Signature Algorithm: sha256WithRSAEncryption
    Signature Value:
        65:4c:e0:ed:10:80:76:bc:82:8c:8f:8d:f1:8d:32:5f:3d:87:
        # ...
```

- Для просмотра серверного сертификата **server.crt**:

```bash
sudo openssl x509 -text -noout -in /etc/mosquitto/certs/server.crt
```

в ответ получиим примерно следующее:

```bash
Certificate:
    Data:
        Version: 1 (0x0)
        Serial Number:
            3f:a2:16:53:82:74:07:0e:f3:e2:59:63:ff:0e:dd:32:2f:c7:14:6f
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: CN = MQTT CA
        Validity
            Not Before: Mar 26 12:16:02 2025 GMT
            Not After : Mar 26 12:16:02 2026 GMT
        Subject: CN = raspberrypi.local
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                Public-Key: (2048 bit)
                Modulus:
                    00:96:64:cd:11:27:16:44:80:fc:04:19:62:b4:61:
                    # ...
                Exponent: 65537 (0x10001)
    Signature Algorithm: sha256WithRSAEncryption
    Signature Value:
        8c:6c:69:17:7e:95:96:5b:6d:97:29:bf:ad:96:ce:78:63:07:
        #...
```

Обратите внимание, на сommon Name (CN) — должен совпадать с IP/доменом Raspberry Pi.

- Для проверки CA ключа **ca.key**:

```bash
sudo openssl rsa -check -in /etc/mosquitto/certs/ca.key -noout
```

Если ключ валиден, то Raspberry выведет `RSA key ok`

- Аналогично, для серверного ключа:

```bash
sudo openssl rsa -check -in /etc/mosquitto/certs/server.key -noout
```

также должно выводиться `RSA key ok`

- Для проверки оответствия сертификата и ключа:

```bash
# Извлеките публичный ключ из сертификата
sudo openssl x509 -pubkey -noout -in /etc/mosquitto/certs/server.crt > pubkey_from_cert.pem

# Извлеките публичный ключ из приватного ключа
sudo openssl rsa -pubout -in /etc/mosquitto/certs/server.key > pubkey_from_key.pem

# Сравните их
diff pubkey_from_cert.pem pubkey_from_key.pem
```

Если вывод пустой - ключи совпадают.

3. Настроим конфигурацию Mosquitto:

Открываем файл конфигурации

```bash
sudo nano /etc/mosquitto/mosquitto.conf
```

И заполняем его следующими данными:

```bash
# MQTT через TLS (порт 8883)
listener 8883
certfile /etc/mosquitto/certs/server.crt
keyfile /etc/mosquitto/certs/server.key
cafile /etc/mosquitto/certs/ca.crt
tls_version tlsv1.2

# WebSocket + TLS (порт 9443)
listener 9443
protocol websockets
certfile /etc/mosquitto/certs/server.crt
keyfile /etc/mosquitto/certs/server.key
cafile /etc/mosquitto/certs/ca.crt
tls_version tlsv1.2

# Базовый MQTT (порт 1883)
listener 1883 0.0.0.0
allow_anonymous false
password_file /etc/mosquitto/passwd
```

Сохраняем файл `Ctrl + O` и выходим `Ctrl + X`

4. Добавляем авторизацию по логину и паролю:

- Создаем первого пользователя

```bash
sudo mosquitto_passwd -c /etc/mosquitto/passwd username
```

- **-c** — создает новый файл паролей (используется только при создании первого пользователя, иначе файл перезапишется!).
- **/etc/mosquitto/passwd** — путь к файлу с паролями.
- **username** — имя пользователя.

После ввода команды, Raspberry запросит пароль для пользователя **username** и сохранит его в файле **/etc/mosquitto/passwd**.

- Для добавления нового пользователя используется та же утилита, но без параметра **-c**:

```bash
sudo mosquitto_passwd -c /etc/mosquitto/passwd username2
```

- Для того, чтобы узнать список зарегистрированных пользователей вводим:

```bash
mosquitto_passwd -l /etc/mosquitto/passwd
```

В ответ Raspberry выведет список зарегистрированных пользователей в формате:

```bash
user1:$6$J7uZz...$HASH...
user2:$6$kLmNp...$HASH...
```

- Для удаления пользователя необходимо в теринале ввести:

```bash
mosquitto_passwd -d /etc/mosquitto/passwd username
```

5. Запускаем или перезапускаем службу Mosquitto:

- Запуск

```bash
sudo mosquitto -c /etc/mosquitto/mosquitto.conf -v
```

- Перезапуск

```bash
sudo systemctl restart mosquitto
```

- Если нужно остановить сервис:

```bash
sudo systemctl stop mosquitto
```

6. Добавим Mosquitto в автозагрузку:

```bash
sudo systemctl enable mosquitto
```

7. Проверяем работоспособность Mosquitto:

- Проверка статуса сервиса:

```bash
sudo systemctl status mosquitto
```

- Просмотр логов

```bash
sudo journalctl -u mosquitto -f
```

8. Проверяем доступность сервиса Mosquitto:
