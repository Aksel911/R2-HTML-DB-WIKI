
# R2-HTML-DB-WIKI🎮

<div align="center">

![GitHub last commit](https://img.shields.io/github/last-commit/Aksel911/R2-HTML-DB-WIKI)
![GitHub stars](https://img.shields.io/github/stars/Aksel911/R2-HTML-DB-WIKI)
![GitHub forks](https://img.shields.io/github/forks/Aksel911/R2-HTML-DB-WIKI)

**Созданно [Victor Pavlov](https://vk.com/akselrus) | [R2Genius](https://vk.com/r2genius)**

*(Современная вики для R2 Online по собственной базе данных с удобным интерфейсом и расширенным функционалом)*

*SOURCE CODE:* [R2-HTML-DB](https://github.com/Aksel911/R2-HTML-DB)
</div>

## 🌟 Основные функции

### 🎨 Адаптивный дизайн
Поддержка светлой и темной темы для комфортного использования:

<details>
<summary>Скриншоты тем</summary>

#### Светлая тема
![Light Mode](https://github.com/Aksel911/R2-HTML-DB/blob/main/github/pics/Main_White.png?raw=true)

#### Темная тема
![Dark Mode](https://github.com/Aksel911/R2-HTML-DB/blob/main/github/pics/Main_Black.png?raw=true)
</details>

### 📱 Удобная навигация
Интуитивное скролл-меню для быстрого доступа к нужным разделам:
![Скролл-меню](https://github.com/Aksel911/R2-HTML-DB/blob/main/github/pics/Menu_Example.png?raw=true)

### 🔍 Расширенный поиск
Мощная система поиска по собственной базе данных монстров, предметов, продавцов и прочего:
![Поиск](https://github.com/Aksel911/R2-HTML-DB/blob/main/github/pics/Monster_Table_Example.png?raw=true)

## 💎 Основные разделы

### ⚔️ Экипировка
- **Доспехи**
  ![Доспехи](https://github.com/Aksel911/R2-HTML-DB/blob/main/github/pics/Armor_Example.png?raw=true)
- **Оружие**
  ![Оружие](https://github.com/Aksel911/R2-HTML-DB/blob/main/github/pics/Weapon_Example.png?raw=true)

### 👾 Бестиарий
Подробная информация о монстрах и NPC с анимированными моделями:
![Монстры/NPC](https://github.com/Aksel911/R2-HTML-DB/blob/main/github/pics/Monster_Example.png?raw=true)

### 🛠️ Системы крафта
- **Крафт свитками**
  ![Крафт свитками](https://github.com/Aksel911/R2-HTML-DB/blob/main/github/pics/Scroll_Craft_Example.png?raw=true)
- **Обычный крафт**
  ![Крафт](https://github.com/Aksel911/R2-HTML-DB/blob/main/github/pics/Ring_Craft_Example.png?raw=true)

### 📦 Прочие предметы
![Etc](https://github.com/Aksel911/R2-HTML-DB/blob/main/github/pics/Etc_Example.png?raw=true)

## ⚙️ Настройка конфигурации через `.env`

Перед первым запуском **обязательно выполните настройку `.env` файла**:

### 1. Переименуйте файл

Скопируйте или переименуйте `.env.example` в `.env`:
```bash
cp .env.example .env
```

### 2. Откройте .env в любом текстовом редакторе
Пример содержимого:
```
DB_DRIVER={ODBC Driver 17 for SQL Server}
DB_SERVER=localhost
DB_NAME=FNLParm
DB_USER=sa
DB_PASSWORD=SqlServer2025!
PORT=5000
GITHUB_URL=https://raw.githubusercontent.com/Aksel911/R2-HTML-DB/main/static/
```

### 3. Настройте параметры под вашу среду:
- ```DB_DRIVER``` — драйвер ODBC для подключения к MSSQL
- ```DB_SERVER``` — адрес или имя сервера MSSQL
- ```DB_NAME``` — имя вашей базы данных
- ```DB_USER``` и ```DB_PASSWORD``` — учётные данные доступа
- ```PORT``` — порт запуска сервиса (по умолчанию 5000)
- ```GITHUB_URL``` — URL для статики (можно оставить по умолчанию)

## 💡 [Docker FAQ]

Перед началом вам необходимо закинуть вашу базу данных: ```FNLParm.bak``` в папку: ```docker_database```, далее использовать .env:

### [Docker] Нужный .env конфиг-файл
```
DB_DRIVER={ODBC Driver 17 for SQL Server}
DB_SERVER=localhost
DB_NAME=FNLParm
DB_USER=sa
DB_PASSWORD=SqlServer2025!
PORT=5000
GITHUB_URL=https://raw.githubusercontent.com/Aksel911/R2-HTML-DB/main/static/
```

### [Docker] Шаги для запуска проекта

1. **Установите Docker и Docker Compose:**
    - **Linux:**
      ```bash
      sudo apt-get update
      sudo apt-get install docker docker-compose
      ```
    - **Windows / macOS:**
      Скачайте и установите Docker Desktop с [официального сайта](https://www.docker.com/products/docker-desktop).

2. **Клонируйте репозиторий:**
    ```bash
    git clone https://github.com/Aksel911/R2-HTML-DB.git
    cd R2-HTML-DB
    ```

3. **Запустите проект:**
    ```bash
    docker-compose up -d
    ```

4. **Проверьте статус контейнеров:**
    ```bash
    docker ps
    ```

5. **Для остановки проекта:**
    ```bash
    docker-compose down
    ```

*Примечание:*
- Проект будет доступен по адресу `http://127.0.0.1:5000` после запуска.


##


## 🤝 Вклад в проект

Если вы хотите внести свой вклад в развитие проекта:
1. Создайте форк репозитория
2. Создайте ветку для своих изменений
3. Внесите необходимые изменения
4. Создайте Pull Request

##

<div align="center">
Made with ❤️ for R2 Online community
</div>
