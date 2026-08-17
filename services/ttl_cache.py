"""Потокобезопасный TTL-кэш для тяжёлых read-only выборок.

Данные в вики игровые и статичные — меняются только при обновлении БД,
поэтому целые списочные выборки (монстры, предметы, скиллы и т.д.)
имеет смысл держать в памяти процесса несколько минут.

Очистка ленивая: протухшие ключи выбрасываются при обращении и при вставке,
поэтому отдельный планировщик (apscheduler) этому кэшу не нужен.

ВАЖНО: кэш отдаёт ССЫЛКУ на закэшированный объект, а не копию.
Вызывающий код обязан не мутировать полученные списки/словари
(фильтры и *_to_dict в сервисах создают новые списки — это безопасно).
"""

import inspect
import logging
import threading
import time
from functools import wraps
from typing import Any, Callable

logger = logging.getLogger(__name__)

# TTL по умолчанию — 10 минут
DEFAULT_TTL = 600

# Маркер "в кэше ничего нет" (None — валидное закэшированное значение)
_MISS = object()


def _normalize(value: Any) -> Any:
    """Приводит аргументы к хэшируемому виду (списки типов/классов -> кортежи)"""
    if isinstance(value, (list, tuple)):
        return tuple(_normalize(v) for v in value)
    if isinstance(value, set):
        return frozenset(value)
    if isinstance(value, dict):
        return tuple(sorted((k, _normalize(v)) for k, v in value.items()))
    return value


class TTLCache:
    """Простой TTL-кэш с ограничением по числу ключей.

    Контейнер приложения ограничен 512 MB, поэтому max_size задаётся
    отдельно под каждый кэш — исходя из веса одной записи.
    """

    def __init__(self, max_size: int = 16, ttl: int = DEFAULT_TTL, name: str = ''):
        self.max_size = max_size
        self.ttl = ttl
        self.name = name
        self._lock = threading.RLock()
        # key -> (value, created_at)
        self._store = {}

    def get(self, key: Any, default: Any = None) -> Any:
        with self._lock:
            entry = self._store.get(key, _MISS)
            if entry is _MISS:
                return default
            value, created_at = entry
            if time.time() - created_at < self.ttl:
                return value
            # Протухло — выбрасываем
            self._store.pop(key, None)
            return default

    def set(self, key: Any, value: Any) -> None:
        with self._lock:
            # Чистим протухшее на КАЖДОЙ записи, а не только при переполнении:
            # ключей мало (десятки), зато память из-под старых выборок
            # освобождается сразу, а не висит до вытеснения по размеру.
            self._drop_expired()
            if key not in self._store and len(self._store) >= self.max_size:
                self._evict()
            self._store[key] = (value, time.time())

    def invalidate(self, key: Any) -> None:
        with self._lock:
            self._store.pop(key, None)

    def clear(self) -> None:
        with self._lock:
            self._store.clear()

    def _drop_expired(self) -> None:
        """Выбрасывает протухшие записи (вызывать под локом)"""
        now = time.time()
        ttl = self.ttl
        expired = [k for k, (_, created_at) in self._store.items()
                   if now - created_at >= ttl]
        for k in expired:
            self._store.pop(k, None)

    def _evict(self) -> None:
        """Сначала чистим протухшее, если не помогло — выбрасываем самое старое"""
        self._drop_expired()

        if len(self._store) >= self.max_size and self._store:
            oldest_key = min(self._store, key=lambda k: self._store[k][1])
            self._store.pop(oldest_key, None)


def cached(cache: TTLCache) -> Callable:
    """Декоратор: кэширует результат функции по её аргументам.

    Применять только к read-only выборкам, результат которых
    вызывающий код не мутирует.
    """
    def decorator(func: Callable) -> Callable:
        prefix = f"{func.__module__}.{func.__name__}"
        signature = inspect.signature(func)

        def _build_key(args, kwargs):
            # Приводим позиционные и именованные аргументы к одному виду,
            # чтобы f(x) и f(arg=x) попадали в один ключ
            try:
                bound = signature.bind(*args, **kwargs)
                bound.apply_defaults()
                return (prefix, _normalize(tuple(bound.arguments.items())))
            except TypeError:
                return (prefix, _normalize(args), _normalize(kwargs))

        @wraps(func)
        def wrapper(*args, **kwargs):
            key = _build_key(args, kwargs)
            result = cache.get(key, _MISS)
            if result is not _MISS:
                return result

            # Считаем вне лока: тяжёлый запрос к MSSQL не должен блокировать
            # остальные потоки (в худшем случае два потока посчитают одно и то же)
            result = func(*args, **kwargs)
            cache.set(key, result)
            return result

        # Доступ к кэшу для ручной инвалидации: func.cache.clear()
        wrapper.cache = cache
        return wrapper

    return decorator
