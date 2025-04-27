---
title: "Хостим свой сайт на Raspberry Pi"
date: "2025-04-27"
---

# Хостим свой сайт на Raspberry Pi

2025-04-27

![raspberry](/images/raspberry.webp)

## Содержание

- [Хостим свой сайт на Raspberry Pi](#хостим-свой-сайт-на-raspberry-pi)
  - [Содержание](#содержание)
  - [Определение IP-адреса](#определение-ip-адреса)
  - [Регистрация доменного имени](#регистрация-доменного-имени)
  - [Конфигурация Raspberry Pi](#конфигурация-raspberry-pi)
  - [Автоматический деплой из GitHub](#автоматический-деплой-из-github)
  - [Подключаем Cloudflare](#подключаем-cloudflare)

Доброго времени суток! В этой статье рассмотрим процесс настройки Raspberry Pi 4 для хостинга своего веб сайта.

## Определение IP-адреса

- Для начала, нужно убедиться что IP-адрес, который вам выделяет провайдер совпадает с вашим реальным IP в мировой паутине. Для этого нужно сравнить IP-адрес в вашем роутере с адресом, определяемым сервисами определения IP, например **[2ip.ru](https://2ip.ru)**. Если они совпадают, то поздравляю - вы счастливый владелец уникального публичного IP-адреса, если же они различаются, то скорее всего ваш провайдер применяет технологию **Carrier-Grade NAT (CGNAT)**, которая позволяет множеству пользователей совместно использовать один или несколько публичных IP-адресов в целях их экономии. Данная проблема обычно решается провайдером за деньги, в моем случае с **Ростелекомом** за **150** рублей плюсом в месяц к тарифу.
- После получения от провайдера "белого" IP адреса, необходимо в настройках роутера пробросить порт 80 из внутренней (локальной) сети в мировую паутину. Для этого нужно зайти в панель администрирования роутера (обычно адрес **192.168.0.1** или **192.168.1.1**, пользователь **admin**, пароль **admin**) и выбрать пункт, связанный с перенаправлением портов. Чаще всего искать по ключевому слову **NAT**. В случае моего роутера **RV6699** от **Ростелеком** это выглядит примерно так:

![reg.ru](/images/router.png)

- Просто пробросить порты в моем **RV6699** оказалось недостаточно, потребовалось еще добавить Raspberry в **DMZ** (Demilitarized Zone) — это функция, которая позволяет выделить устройство в локальной сети в отдельную зону, открытую для доступа из интернета. Проверить доступность портов извне можно например с **[этого](https://www.yougetsignal.com/tools/open-ports/)** сервиса.

![reg.ru](/images/router_dmz.png)

## Регистрация доменного имени

-Для того, чтобы получить уникальное имя для вашего сайта нужно зарегистрировать его в системе регистрации доменных именю. В сети существует достаточно много различных сервисов получения доменного имени как платных, так и бесплатных. Я выбрал сервис регистрации доменных имен **[РЕГ.РУ](https://www.reg.ru)**. Он платный, но позволяет получить доменное имя первого уровня в зоне **RU**, за приемлемую сумму.

- Процесс регистрации доменного имени интуитивно понятен, никаких особых подводных камней нет. Заходим на **[сайт](https://www.reg.ru)**, регистрируемся (придется указать свои персональные данные), далее выбираем **Заказать**

![reg.ru](/images/reg1.png)

- вводим желаемое имя домена

![reg.ru](/images/reg2.png)

- выбираем наиболее приглянувшееся и кликаем "Подобрать"

![reg.ru](/images/reg3.png)

- далее переходим в заказ, все дополнительные опции пока можно отключить и оплачиваем

![reg.ru](/images/reg4.png)

- Поздравляю, вы стали счастливым владельцем уникального доменного имени за 119 рублей в год (скромно промолчим, что это только за 1 года, далее...). Осталось лишь настроить ваш сервер в **Raspberry**, к чему мы сейчас и перейдем.

## Конфигурация Raspberry Pi

- Открываем **PowerShell**: <kbd>Win</kbd> + <kbd>X</kbd> выбираем **Windows PowerShell (Администратор)**, или просто можно в любом месте нажать правую кнопку мыши с зажатым <kbd>Shift</kbd> и выбрать **Открыть окно PowerShell здесь**.

- Подключаемся к **Raspberry**

  ```powershell
  ssh user@your_ip
  ```

  где **user** и **your_ip** - имя пользователя и ip адрес вашей **Raspberry**
  Если у вас включена авторизация по паролю, то малинка попросит вас его ввести, если вы используете авторизации на оcнове ssh-ключей, то пароль вводить не нужно.

- Для начала обновим все компоненты системы

  ```powershell
  sudo apt update && sudo apt upgrade -y
  ```

- Некоторые пакеты (например **nodejs**) удобно устанавливать с помощью **[Chocolatey](https://chocolatey.org/)** - это менеджер пакетов для операционных систем Windows, который позволяет устанавливать, обновлять и управлять программным обеспечением с помощью командной строки.

  ```powershell
  Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
  ```

- После завершения установки перезапускаем PowerShell или вручную добавляем путь к **Chocolatey** в переменную среды `PATH`:

  ```powershell
  $env:Path += ";$($env:ALLUSERSPROFILE)\chocolatey\bin"
  ```

- Проверяем установку **Chocolatey**:

  ```powershell
  choco --version
  ```

- Если все Ok, то устанавливаем **Node.js**.

  ```powershell
  choco install nodejs
  ```

- Для хостинга веб сервера будем использовать **Nginx**. Устанавливаем его:

  ```powershell
  sudo apt install nginx -y
  ```

- Устанавливаем **Git** и проверяем его установку:

  ```powershell
  sudo apt install git -y
  git --version
  ```

- Устанавливаем **PM2** - это продвинутый менеджер процессов для Node.js, который позволяет запускать, управлять и мониторить приложения Node.js в фоновом режиме. Он обеспечивает автоматическую перезагрузку приложений при падении, балансировку нагрузки, мониторинг ресурсов и многое другое.

  ```powershell
    sudo npm install -g pm2
  ```

- Предполагается, что вы уже имеете некий веб-сервер на Node.js, если еще нет, то **[тут](http://code-core.ru/articles/Create-webpage-on-nextjs)** я вкратце расписал основные шаги для его разработки.
- Чтобы перенести ваш веб сервер из репозитория GitHub на ваш **Raspberry** клонируем репозиторий:

  ```powershell
  git clone https://github.com/username/my_blog.git
  ```

  где **username** - ваш логин на GitHub, а **my_blog** - название вашего репозитория

- Переходим в созданную директорию:

  ```powershell
  cd my_blog
  ```

- Устанавливаем зависимости:

  ```powershell
  npm install
  ```

- Собираем сервер:

  ```powershell
  npm run build
  ```

- Запускаем и убеждаемся в его работоспособности:

  ```powershell
  npm start
  ```

- Далее нужно прописать конфигурацию **Nginx**, для чего нужно создать новый конфигурационный файл в директории `/etc/nginx/sites-available/`

  ```powershell
  sudo nano /etc/nginx/sites-available/my_blog
  ```

  и скопировать в него следующее содержимое:

  ```nginx
  # Блок для обработки запросов по IP
  server {
      listen 80 default_server;  # Обработка всех запросов по умолчанию
      server_name your_ip_address;
      location / {
          proxy_pass http://127.0.0.1:3000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
      }
  }

  # Блок для обработки запросов с доменного имени
  server {
      listen 80;
      server_name some-domain.ru www.some-domain.ru;
      location / {
          proxy_pass http://127.0.0.1:3000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
      }
  }
  ```

  вместо **your_ip_address** нужно ввести внешний IP-адрес вашего Raspberry Pi, вместо **some-domain.ru** - доменное имя, полученное на **РЕГ.РУ**, **3000** это порт, на котором работает ваш веб-сервер (номер порта отображается в консоли после запуска `npm start`)

- Далее создаем символическую ссылку (это аналог ярлыка в Windows) на наш конфигурационный файл:

  ```powershell
  sudo ln -s /etc/nginx/sites-available/my_blog /etc/nginx/sites-enabled/
  ```

  Эта команда создает ярлык файла конфигурации сайта **my_blog**, расположенного в папке **sites-available**, в папку **sites-enabled**. Дело в том, что **Nginx** по умолчанию использует конфигурации, размещенные в папке **sites-enabled**, а в **sites-available** хранятся вообще все конфигурации, даже неактивные. Использование ссылки позволяет использовать сайт, не перемещая его в **sites-enabled**.

- После создания ссылки проверяем конфигурацию:

  ```powershell
  sudo nginx -t
  ```

  Если все нормально, то дожно появиться сообщение:

  ```nginx
  nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
  nginx: configuration file /etc/nginx/nginx.conf test is successful
  ```

- Перезапускаем **Nginx**:

  ```powershell
  sudo systemctl restart nginx
  ```

- Проверяем работоспособность сервера:

  ```powershell
  curl http://your_ip_address
  ```

- Теперь давайте добавим сайт в менеджер **PM2**:

  ```powershell
  pm2 start npm --name "my_blog" -- start
  ```

- Перезапускаем **PM2** и добавляем его в автозагрузку:

  ```powershell
  pm2 save
  pm2 startup
  sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u admin --hp /home/admin
  ```

- Перезагружаем **Raspberry Pi**:

  ```powershell
  sudo reboot now
  ```

  и убеждаемся, что все работает.

  ## Автоматический деплой из GitHub

- Теперь дополним наш сервер функцией автоматического деплоя из GitHub. Для этого будем использовать Web перехватчики, или так называемые веб хуки.
- Веб хуки это способ автоматического обмена данными между приложениями. Они работают по принципу «событие → реакция»: когда в одной системе происходит определенное событие (например, оплата заказа, коммит в репозитории или новое сообщение), она отправляет HTTP-запрос (чаще POST) на заранее указанный URL (вебхук) другой системы, что позволяет мгновенно обмениваться информацией без постоянного опроса серверов.
- Для того чтобы настроить вебхук нужно зайти в репозиторий проекта, который мы хотим деплоить с гитхаба (в нашем случае `my_blog`), далее идем `Settigs - Webhooks - Add webhook`, в поле `Payload URL` вводим URL и порт нашего сервера, через который будут приходить запросы, например `http://IP:Port/webhook` (IP -внешний адрес Rasзberry Pi, Port - любой порт Raspberry, доступ к которому нужно будет открыть в вашем роутере, например **3030**). В поле `Content type` выбираем `Appication/JSON`, в поле `Secret` вводим любой секретный ключ, в поле `Which events would you like to trigger this webhook?` выбираем `Push events`. После чего нажимаем `Add webhook`.

- На этом настройка репозитория Гитхаба завершена, переходим к нашей Raspberry.

- Коннектимся к Raspberry через SSH: `ssh user@your_ip`
- Создаем директорию webhook-server:

  ```powershell
  mkdir webhook-server
  ```

- Переходим в директорию:

  ```powershell
  cd webhook-server
  ```

- Создаем файл автоматического обновления приложения из репозитория `update_my_blog.sh` (Имя можете выбрать любое):

  ```powershell
  nano update_my_blog.sh
  ```

- В этом файле вводим следующий код:

  ```powershell
  #!/bin/bash

  # Конфигурация
  APP_DIR="/home/admin/my_blog"
  LOG_FILE="/home/admin/webhook-server/deploy.log"
  PM2_APP_NAME="my_blog"
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

  # Логирование
  exec > >(tee -a "${LOG_FILE}") 2>&1

  echo "========================================"
  echo "[${TIMESTAMP}] Starting deployment"
  echo "Working directory: ${APP_DIR}"
  echo "Node version: $(node -v)"
  echo "NPM version: $(npm -v)"
  echo "Git version: $(git --version)"
  echo "User: $(whoami)"

  # Переход в директорию
  echo "[1/5] Entering application directory..."
  cd "${APP_DIR}" || {
    echo "FAILED: Can't enter directory ${APP_DIR}"
    exit 1
  }

  # Обновление кода
  echo "[2/5] Pulling latest changes from Git..."
  git fetch --all
  git pull origin master || {
    echo "FAILED: Git pull error"
    exit 1
  }
  echo "Current commit: $(git log -1 --pretty=%B)"

  # Установка зависимостей
  echo "[3/5] Installing dependencies..."
  npm ci --production || {
    echo "FAILED: npm install error"
    exit 1
  }

  # Сборка проекта
  echo "[4/5] Building application..."
  npm run build || {
    echo "FAILED: Build error"
    exit 1
  }

  # Перезапуск PM2
  echo "[5/5] Restarting PM2..."
  pm2 restart "${PM2_APP_NAME}" --update-env || {
    echo "FAILED: PM2 restart error"
    exit 1
  }

  echo "Deployment completed successfully!"
  echo "PM2 status:"
  pm2 list
  ```

  В коде файла `admin` и `my_blog` замените на имя вашего пользователя Raspberry и название вашего репозитория GitHub.

- Этот файл открывает каталог с проектом `/home/admin/my_blog`, обновляет содержимое из удаленного репозитория, устанавливает зависимости, собирает приложение, перезапускает PM2 и выводит результаты в лог.

- Проверяем работоспособность скрипта:

  ```powershell
  sh update_my_blog.sh
  ```

- Если все нормально, должно начаться обновление приложения. Теперь нам нужно связать скрипт обновления с вебхуком от GitHub. Для этого необходимо написать небольшой сервер, который будет слушать POST-запросы от GitHub и запускать скрипт обновления.

- Для этого в директории `webhook-server` создадим файл `webhook-server.js`:

  ```powershell
  nano webhook-server.js
  ```

- В этом файле вводим следующий код:

  ```javascript
  const express = require("express");
  const crypto = require("crypto");
  const { exec } = require("child_process");
  const fs = require("fs");
  const app = express();

  const SECRET = "YOUR_SECRET_KEY";
  const PORT = 3030;
  const LOG_FILE = "/home/admin/webhook-server/deploy.log";

  // Логирование в файл
  function logToFile(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(LOG_FILE, logMessage);
  }

  app.use(express.json());

  app.post("/webhook", (req, res) => {
    const signature = req.headers["x-hub-signature-256"];
    const event = req.headers["x-github-event"];
    const ip = req.ip;

    logToFile(`New request from IP: ${ip} | Event: ${event}`);

    // Проверка подписи
    const hmac = crypto.createHmac("sha256", SECRET);
    const digest =
      "sha256=" + hmac.update(JSON.stringify(req.body)).digest("hex");

    if (signature !== digest) {
      logToFile("INVALID SIGNATURE!");
      return res.status(403).send("Forbidden");
    }

    if (event === "push") {
      logToFile("Valid push event received. Starting update...");

      const child = exec(
        "/bin/bash /home/admin/webhook-server/update_my_blog.sh",
        { env: process.env },
        (err, stdout, stderr) => {
          if (err) {
            logToFile(`EXEC ERROR: ${err.message}`);
            logToFile(`STDERR: ${stderr}`);
            return res.status(500).send("Update error");
          }
          logToFile(`Update successful. Output: ${stdout}`);
          res.status(200).send("OK");
        }
      );

      // Логирование в реальном времени
      child.stdout.on("data", (data) => {
        logToFile(`STDOUT: ${data.toString().trim()}`);
      });

      child.stderr.on("data", (data) => {
        logToFile(`STDERR: ${data.toString().trim()}`);
      });
    } else {
      logToFile(`Ignored event: ${event}`);
      res.status(200).send("Ignored event");
    }
  });

  app.listen(PORT, () => {
    logToFile(`Server started on port ${PORT}`);
    console.log(`Server running on port number ${PORT}`);
  });
  ```

- Вместо `admin` вставляем актуальное имя пользователя Raspberry, а в `YOUR_SECRET_KEY` указываем секретный ключ, который вы указали в настройках репозитория GitHub.

- Этот код реализует вебхук-сервер на Express.js для автоматического обновления приложения при пуше в GitHub-репозиторий. Сервер прослушивает порт 3030, который вы указали в настройках WebHook репозитория GitHub. В случае, если вы указали другой порт то измените его значение на актуальный.
- Код работает примерно следующим образом - при получении POST на адрес `/webhook` извлекает подпись заголовка `x-hub-signature-256`, тип события - Github `x-github-event` и IP-адрес отправителя `req.ip`. Далее генерируется HMAC-SHA256 на основе тела запроса и секрета. Если подпись верна, обрабатывает событие `push` и запускает скрипт обновления. Если нет, то возвращает 403. Если событие не `push`, то возвращает 200 и сообщение о том, что событие проигнорировано. Все события логируются в лог-файл `/home/admin/webhook-server/deploy.log`. Если скрипт обновления завершается с ошибкой, то возвращает 500 и сообщение об ошибке.

- Для управления работой сервера вебхуков используем уже привычный **PM2**:

  ```powershell
  pm2 start webhook-server.js
  pm2 save
  pm2 startup
  ```

- Теперь можно проверить работоспособность сервера, для чего вносим какие нибудь изменения в нашем проекте и отправляем push в репозиторий. Работу скрипта обновления можно проверить в реальном времени, выполнив на Raspberry команду:

  ```powershell
  tail -f /home/admin/webhook-server/deploy.log
  ```

  Если все нормально, то в консоли можно наблюдать процесс обновления приложения.

## Подключаем Cloudflare

- Cloudflare — это многофункциональная платформа, которая используется для повышения безопасности, производительности и надежности веб-ресурсов. Основные плюшки Cloudflare:

  - Защита от DDoS атак. Cloudflare автоматически фильтрует вредоносный трафик, защищая ваш сервер от перегрузки.
  - Защита от ботов. Встроенные инструменты (например, Bot Fight Mode) блокируют вредоносных ботов, спам и парсеров.
  - Встроенный файрвол Web Application Firewall (WAF). Правила WAF блокируют SQL-инъекции, XSS, подозрительные запросы и другие угрозы.
  - Ускорение сайтов (CDN). Cloudflare хранит копии статических файлов (изображения, CSS, JS) на своих серверах по всему миру, ускоряя их загрузку для пользователей.
  - Запросы перенаправляются на ближайший к пользователю сервер Cloudflare, снижая задержки.
  - Сокрытие реального IP-адреса. Весь трафик идет через серверы Cloudflare, что скрывает IP-адрес вашего Raspberry Pi или сервера. Это защищает от прямых атак на вашу инфраструктуру.
  - SSL/TLS шифрование. Бесплатные сертификаты: Cloudflare предоставляет SSL-сертификаты для защиты данных между пользователем и сервером (HTTPS).
  - Управление DNS. Быстрое и надежное DNS-распределение. Поддержка DNSSEC для защиты от подделки DNS-записей.
  - Аналитика и мониторинг. Детальная статистика по трафику, угрозам, производительности.

Для регистрации в Cloudflare переходим по [этому](https://www.cloudflare.com/) адресу, создаем аккаунт и на главной странице кликаем `Add a domain`

![cloudflare](/images/cloudflare-main.png)

- Вводим доменное имя, ставим галку `Quick scan for DNS records` и жмем `Continue`

![cloudflare](/images/cloudflare-domain.png)

- Выбираем тарифный план, после чего Cloudflare проведет проверку DNS-записей в нашем домене и предложит заменить DNS запись, выданную вашим сервисом регистрации доменных имен (в нашем случае это **РЕГ.РУ**) на свою.

![cloudflare](/images/cloudflare-dns.png)

- Далее идем на сервис регистрации доменных имен **[РЕГ.РУ](https://www.reg.ru)**, выбираем свой домен, жмем `DNS серверы и управление зоной`

![reg.ru](/images/regru-dns.png)

- выбираем `Изменить` и в разделе `Свой саисок DNS-серверов` вводим адреса DNS-серверов, предлагаемых Cloudflare.

![reg.ru](/images/regru-dns1.png)

- Жмем продолжить и ждем, пока Cloudflare обновит DNS-записи.

На этом пока все. Good luck!
