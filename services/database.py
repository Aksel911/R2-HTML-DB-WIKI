import os
import time
import queue
import logging
import threading
from contextlib import contextmanager

import pyodbc
from flask import current_app

logger = logging.getLogger(__name__)

# Свой пул на уровне процесса, поэтому пулинг ODBC-драйвера отключаем:
# два слоя пулинга дублируют работу и мешают контролировать живость соединений
# (драйвер может отдать «мёртвый» дескриптор в обход нашей проверки).
pyodbc.pooling = False

# Параметры пула (на КАЖДЫЙ процесс-воркер gunicorn)
POOL_SIZE = int(os.getenv('DB_POOL_SIZE', '8'))           # макс. одновременных соединений
POOL_TIMEOUT = float(os.getenv('DB_POOL_TIMEOUT', '15'))  # сколько ждать свободный слот, сек
CONNECT_TIMEOUT = int(os.getenv('DB_CONNECT_TIMEOUT', '5'))  # таймаут логина к MSSQL, сек
IDLE_PING_AFTER = float(os.getenv('DB_IDLE_PING_AFTER', '30'))  # пинговать соединение, если простояло дольше, сек

# Пул: очередь из POOL_SIZE слотов. Слот — это либо (conn, last_used_ts),
# либо None ("пустой слот", соединение будет создано лениво при первом использовании).
# Ленивое создание = никаких сокетов на момент импорта модуля/fork() воркеров gunicorn.
_pool: "queue.LifoQueue" = queue.LifoQueue(maxsize=POOL_SIZE)
_pool_lock = threading.Lock()
_pool_pid = None        # pid процесса, которому принадлежат соединения в пуле
_pool_conn_str = None   # строка подключения, под которую собран пул


def _build_conn_str() -> str:
    """Строка подключения из конфига приложения"""
    return ';'.join(f'{k}={v}' for k, v in current_app.config['DATABASE_CONFIG'].items())


def _reset_pool(conn_str: str, close_old: bool):
    """Пересобрать пул пустыми слотами. Вызывать только под _pool_lock."""
    global _pool, _pool_pid, _pool_conn_str
    if close_old:
        while True:
            try:
                slot = _pool.get_nowait()
            except queue.Empty:
                break
            if slot is not None:
                _close_quietly(slot[0])
    _pool = queue.LifoQueue(maxsize=POOL_SIZE)
    for _ in range(POOL_SIZE):
        _pool.put(None)
    _pool_pid = os.getpid()
    _pool_conn_str = conn_str


def _ensure_pool(conn_str: str) -> "queue.LifoQueue":
    """Готовит пул для текущего процесса и текущего конфига БД"""
    global _pool_pid, _pool_conn_str
    with _pool_lock:
        if _pool_pid != os.getpid():
            # Первый вызов в процессе или процесс порождён fork()'ом: унаследованные
            # сокеты использовать нельзя и закрывать нельзя (они общие с родителем),
            # поэтому просто заводим свежий пул пустых слотов.
            _reset_pool(conn_str, close_old=False)
        elif _pool_conn_str != conn_str:
            logger.info("Конфиг БД изменился, пересоздаём пул соединений")
            _reset_pool(conn_str, close_old=True)
        return _pool


def _connect(conn_str: str):
    """Новое соединение с MSSQL"""
    conn = pyodbc.connect(conn_str, timeout=CONNECT_TIMEOUT)
    logger.debug("Открыто новое соединение с БД")
    return conn


def _close_quietly(conn):
    try:
        conn.close()
    except Exception:
        pass


def _is_alive(conn) -> bool:
    """Лёгкая проверка живости: MSSQL рвёт простаивающие соединения"""
    try:
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT 1")
            cursor.fetchall()
        finally:
            cursor.close()
        return True
    except Exception:
        return False


def _is_connection_error(exc: Exception) -> bool:
    """Похоже ли исключение на обрыв соединения (а не на ошибку в SQL)"""
    if isinstance(exc, (pyodbc.OperationalError, pyodbc.InterfaceError)):
        return True
    args = getattr(exc, 'args', ()) or ()
    sqlstate = args[0] if args else None
    # 08xxx — connection exception, HYT00/HYT01 — таймауты драйвера
    return isinstance(sqlstate, str) and (sqlstate.startswith('08') or sqlstate.startswith('HYT'))


def _acquire(pool, conn_str):
    """Берём слот из пула и возвращаем живое соединение"""
    try:
        slot = pool.get(timeout=POOL_TIMEOUT)
    except queue.Empty:
        raise RuntimeError(
            f"Пул соединений исчерпан ({POOL_SIZE}), не дождались свободного за {POOL_TIMEOUT}с"
        )

    if slot is not None:
        conn, last_used = slot
        # Пингуем только залежавшиеся соединения — иначе лишний round-trip на каждый запрос
        if time.monotonic() - last_used < IDLE_PING_AFTER or _is_alive(conn):
            return conn
        logger.info("Соединение из пула мертво, пересоздаём")
        _close_quietly(conn)

    try:
        return _connect(conn_str)
    except Exception:
        pool.put(None)  # слот возвращаем, иначе пул «усохнет» после серии сбоев БД
        raise


def _release(pool, conn, broken: bool):
    """Возвращаем соединение (или пустой слот) обратно в пул"""
    if conn is not None and not broken:
        try:
            # pyodbc открывает транзакцию неявно даже на SELECT — сбрасываем,
            # чтобы не держать блокировки на времени простоя в пуле
            conn.rollback()
            pool.put((conn, time.monotonic()))
            return
        except Exception:
            broken = True
    if conn is not None:
        _close_quietly(conn)
    pool.put(None)


@contextmanager
def get_db_connection():
    """Context manager for database connections (соединение берётся из пула)"""
    conn_str = _build_conn_str()
    pool = _ensure_pool(conn_str)
    conn = _acquire(pool, conn_str)
    broken = False
    try:
        yield conn
    except Exception as e:
        broken = _is_connection_error(e)
        raise
    finally:
        _release(pool, conn, broken)


def close_pool():
    """Закрыть все соединения пула (shutdown / тесты)"""
    with _pool_lock:
        if _pool_pid == os.getpid():
            _reset_pool(_pool_conn_str, close_old=True)


def _run_query(conn, query: str, params, fetch_one: bool):
    cursor = conn.cursor()
    try:
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)

        # Определяем тип запроса
        query_type = query.strip().upper().split()[0]

        # Для SELECT запросов возвращаем результаты
        if query_type == 'SELECT' or query_type == 'WITH':
            if fetch_one:
                return cursor.fetchone()
            return cursor.fetchall()
        # Для остальных запросов (INSERT/UPDATE/DELETE) делаем commit и проверяем успешность
        else:
            conn.commit()
            # После INSERT/UPDATE/DELETE проверяем количество затронутых строк
            affected_rows = cursor.rowcount
            return affected_rows >= 0  # Если операция успешна
    finally:
        try:
            cursor.close()
        except Exception:
            pass


def execute_query(query: str, params=None, fetch_one=False):
    """Execute a database query and return results"""
    query_type = query.strip().upper().split()[0] if query.strip() else ''
    # Читающий запрос можно безопасно повторить, если соединение оборвалось
    # (например, БД перезапустили, а в пуле лежали протухшие соединения).
    # Битое соединение при этом выбрасывается из пула контекст-менеджером.
    attempts = 2 if query_type in ('SELECT', 'WITH') else 1

    for attempt in range(attempts):
        try:
            with get_db_connection() as conn:
                return _run_query(conn, query, params, fetch_one)
        except Exception as e:
            if attempt + 1 < attempts and _is_connection_error(e):
                logger.warning(f"Обрыв соединения с БД, повторяем запрос: {e}")
                continue
            logger.error(f"Database error: {e}")
            logger.error(f"Query: {query}")
            logger.error(f"Params: {params}")
            raise
