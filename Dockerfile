# bookworm закреплён: в trixie удалён apt-key, а msodbcsql17 собран под debian 11/12
FROM python:3.10-slim-bookworm

WORKDIR /app

# Установка ODBC Driver 17 for SQL Server из репозитория Microsoft
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl \
        gnupg2 \
        ca-certificates \
        apt-transport-https && \
    curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/microsoft-prod.gpg] https://packages.microsoft.com/debian/11/prod bullseye main" > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y --no-install-recommends \
        msodbcsql17 \
        unixodbc-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Копирование и установка зависимостей Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копирование файлов приложения
COPY . .

ENV FLASK_APP=app.py \
    FLASK_RUN_HOST=0.0.0.0 \
    PYTHONPATH=/app \
    PYTHONUNBUFFERED=1

EXPOSE 5000

# Прод-сервер: gunicorn, 1 воркер x 8 потоков (хост 2 GB RAM без swap).
# gthread — запросы блокируются на I/O к MSSQL, GIL тут не узкое место,
# поэтому потоки дешевле процессов.
# Один воркер вместо двух: TTL-кэши списочных выборок (services/ttl_cache.py)
# живут в памяти ПРОЦЕССА, при двух воркерах они дублировались целиком.
# --max-requests оставлен: периодический перезапуск воркера подчищает
# фрагментацию кучи и утечки; с одним воркером это даёт краткую паузу — приемлемо.
CMD ["gunicorn", \
     "--bind", "0.0.0.0:5000", \
     "--worker-class", "gthread", \
     "--workers", "1", \
     "--threads", "8", \
     "--timeout", "120", \
     "--graceful-timeout", "30", \
     "--keep-alive", "5", \
     "--max-requests", "1000", \
     "--max-requests-jitter", "100", \
     "--error-logfile", "-", \
     "app:app"]
