"""Счётчики разделов для главной страницы: сколько предметов, монстров и т.д. в базе.

Главная страница НИКОГДА не ждёт БД: по '/' бьёт healthcheck контейнера,
и упавшая или медленная база не должна валить его. Поэтому счётчики считаются
в фоновом потоке и кладутся в кэш, а запрос отдаёт то, что есть (или ничего —
тогда шаблон просто не показывает цифры).
"""
import logging
import threading

from flask import current_app

from services.database import execute_query
from services.ttl_cache import TTLCache

logger = logging.getLogger(__name__)

# Данные меняются только при обновлении дампа БД — пересчёт раз в 6 часов
STATS_TTL = 6 * 3600

_cache = TTLCache(max_size=2, ttl=STATS_TTL, name='site_stats')
_refresh_lock = threading.Lock()
_refreshing = False

# Условия повторяют JOIN'ы детальных роутов и sitemap'а, чтобы цифры совпадали
# с тем, что реально открывается на сайте
STATS_QUERIES = {
    'items': (
        "SELECT COUNT(DISTINCT i.IID) FROM DT_Item i WITH (NOLOCK) "
        "INNER JOIN DT_ItemResource r WITH (NOLOCK) "
        "ON r.ROwnerID = i.IID AND r.RType = 2"
    ),
    'monsters': "SELECT COUNT(*) FROM DT_Monster WITH (NOLOCK)",
    'skills': "SELECT COUNT(*) FROM DT_Skill WITH (NOLOCK)",
    'abnormals': "SELECT COUNT(*) FROM DT_Abnormal WITH (NOLOCK)",
    'merchants': (
        "SELECT COUNT(DISTINCT a.ListID) FROM TblMerchantSellList a WITH (NOLOCK) "
        "INNER JOIN TblMerchantName b WITH (NOLOCK) ON a.ListID = b.mID "
        "INNER JOIN DT_Monster c WITH (NOLOCK) ON b.mID = c.mSellMerchanID"
    ),
    'servants': "SELECT COUNT(DISTINCT IID) FROM TblServantType WITH (NOLOCK)",
}


def _compute_stats() -> dict:
    stats = {}
    for key, query in STATS_QUERIES.items():
        try:
            row = execute_query(query, fetch_one=True)
            count = int(row[0]) if row else 0
        except Exception as e:
            logger.warning(f'site_stats: не удалось посчитать {key}: {e}')
            continue
        if count > 0:
            stats[key] = count
    return stats


def _refresh_in_background(app) -> None:
    global _refreshing
    with _refresh_lock:
        if _refreshing:
            return
        _refreshing = True

    def worker():
        global _refreshing
        try:
            with app.app_context():
                stats = _compute_stats()
            # Пустой результат (БД недоступна) не кэшируем: следующий запрос
            # главной запустит пересчёт заново
            if stats:
                _cache.set('stats', stats)
                logger.info(f'site_stats: пересчитано {stats}')
        except Exception:
            logger.exception('site_stats: фоновый пересчёт упал')
        finally:
            with _refresh_lock:
                _refreshing = False

    threading.Thread(target=worker, name='site-stats-refresh', daemon=True).start()


def get_site_stats() -> dict:
    """Счётчики из кэша. Если их ещё нет — запускает пересчёт в фоне и возвращает {}"""
    stats = _cache.get('stats')
    if stats is None:
        _refresh_in_background(current_app._get_current_object())
        return {}
    return stats
