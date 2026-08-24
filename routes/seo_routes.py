"""SEO-эндпоинты: robots.txt, sitemap.xml, llms.txt.

Sitemap строится из БД (по одному файлу на раздел) и кэшируется в памяти,
чтобы краулеры не нагружали MSSQL: базе на проде и так тесно по памяти.
"""
import logging
from flask import Blueprint, Response, current_app

from services.database import execute_query
from services.ttl_cache import TTLCache
from routes.item_routes import ITEM_ROUTES
from routes.monster_routes import MONSTER_ROUTES

bp = Blueprint('seo', __name__)

logger = logging.getLogger(__name__)

# Sitemap пересобирается не чаще раза в 6 часов — данные меняются только при
# обновлении дампа БД, поэтому долгий TTL безопасен
sitemap_cache = TTLCache(max_size=16, ttl=6 * 3600, name='sitemap')

# Раздел -> (SQL со списком ID, шаблон URL детальной страницы).
# Запросы повторяют JOIN'ы детальных роутов, чтобы sitemap не ссылался на 404:
# например, /item/<id> отдаёт 404 без строки в DT_ItemResource (RType=2).
SITEMAP_SECTIONS = {
    'items': (
        "SELECT DISTINCT i.IID FROM DT_Item i WITH (NOLOCK) "
        "INNER JOIN DT_ItemResource r WITH (NOLOCK) "
        "ON r.ROwnerID = i.IID AND r.RType = 2 ORDER BY i.IID",
        '/item/{}',
    ),
    'monsters': (
        "SELECT MID FROM DT_Monster WITH (NOLOCK) ORDER BY MID",
        '/monster/{}',
    ),
    'skills': (
        "SELECT SID FROM DT_Skill WITH (NOLOCK) ORDER BY SID",
        '/skill/{}',
    ),
    'abnormals': (
        "SELECT AID FROM DT_Abnormal WITH (NOLOCK) ORDER BY AID",
        '/abnormal/{}',
    ),
    'merchants': (
        "SELECT DISTINCT a.ListID FROM TblMerchantSellList a WITH (NOLOCK) "
        "INNER JOIN TblMerchantName b WITH (NOLOCK) ON a.ListID = b.mID "
        "INNER JOIN DT_Monster c WITH (NOLOCK) ON b.mID = c.mSellMerchanID "
        "ORDER BY a.ListID",
        '/merchant/{}',
    ),
    'servants': (
        "SELECT DISTINCT IID FROM TblServantType WITH (NOLOCK) ORDER BY IID",
        '/servant/{}',
    ),
}

# Лимит протокола sitemap — 50 000 URL на файл; режем с запасом
MAX_URLS_PER_SITEMAP = 49000


def _static_paths():
    """Все списочные страницы: главная, категории предметов и монстров, разделы"""
    return (
        ['/']
        + [f'/{key}' for key in ITEM_ROUTES]
        + [f'/{key}' for key in MONSTER_ROUTES]
        + ['/skills', '/abnormals', '/merchants', '/chests', '/quests',
           '/craft_list', '/skill_tree', '/doll', '/servants']
    )


def _xml_response(body: str) -> Response:
    return Response(body, mimetype='application/xml')


def _urlset(paths) -> str:
    site_url = current_app.config['SITE_URL']
    urls = ''.join(
        f'<url><loc>{site_url}{path}</loc></url>' for path in paths
    )
    return (
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        f'{urls}</urlset>'
    )


@bp.route('/sitemap.xml')
def sitemap_index():
    site_url = current_app.config['SITE_URL']
    entries = ''.join(
        f'<sitemap><loc>{site_url}/sitemap-{name}.xml</loc></sitemap>'
        for name in ['static'] + list(SITEMAP_SECTIONS)
    )
    return _xml_response(
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        f'{entries}</sitemapindex>'
    )


@bp.route('/sitemap-static.xml')
def sitemap_static():
    return _xml_response(_urlset(_static_paths()))


@bp.route('/sitemap-<section>.xml')
def sitemap_section(section):
    if section not in SITEMAP_SECTIONS:
        return 'Not found', 404

    cached_xml = sitemap_cache.get(section)
    if cached_xml is None:
        query, url_template = SITEMAP_SECTIONS[section]
        try:
            rows = execute_query(query)
        except Exception:
            logger.exception(f'sitemap-{section}: query failed')
            return 'Service unavailable', 503
        paths = [url_template.format(row[0]) for row in rows[:MAX_URLS_PER_SITEMAP]]
        if len(rows) > MAX_URLS_PER_SITEMAP:
            logger.warning(
                f'sitemap-{section}: {len(rows)} URL, обрезано до {MAX_URLS_PER_SITEMAP}'
            )
        cached_xml = _urlset(paths)
        sitemap_cache.set(section, cached_xml)
    return _xml_response(cached_xml)


ROBOTS_TXT = """\
# R2 Wiki — база знаний R2 Online
# Поисковые боты и AI-агенты (Googlebot, Bingbot, YandexBot, GPTBot, OAI-SearchBot,
# ChatGPT-User, ClaudeBot, Claude-User, PerplexityBot и т.п.) — добро пожаловать.
# Служебные эндпоинты закрыты для всех: HTML-страниц там нет.
# Машиночитаемое описание сайта для AI-агентов: /llms.txt

User-agent: *
Disallow: /api/
Disallow: /ajax/
Disallow: /render_template/

# SEO-скрейперы и агрессивные краулеры: контента для вас здесь нет
User-agent: AhrefsBot
User-agent: SemrushBot
User-agent: MJ12bot
User-agent: DotBot
User-agent: BLEXBot
User-agent: PetalBot
User-agent: Bytespider
User-agent: DataForSeoBot
User-agent: serpstatbot
User-agent: ZoominfoBot
Disallow: /

Sitemap: {site_url}/sitemap.xml
"""


@bp.route('/robots.txt')
def robots():
    body = ROBOTS_TXT.format(site_url=current_app.config['SITE_URL'])
    return Response(body, mimetype='text/plain')


LLMS_TXT = """\
# R2 Wiki

> База знаний по MMORPG R2 Online (Reign of Revolution): предметы, монстры,
> навыки, эффекты, торговцы, крафт, квесты и слуги (питомцы). Данные извлечены
> из игровой базы данных и связаны перекрёстными ссылками. Язык сайта — русский.

Сайт: {site_url}
Полный список страниц: {site_url}/sitemap.xml

## Разделы (HTML)

- [Предметы]({site_url}/item_all): категории — /weapon, /armor, /helmet, /gloves,
  /boots, /cloak, /ring, /belt, /necklace, /earrings, /shield, /arrows, /books,
  /potions, /materials, /etc, /quest, /event, /sphere
- [Монстры]({site_url}/monster_all): /monster_regular, /monster_boss,
  /monster_raidboss, /monster_imennoy, /monster_npc, /monster_event
- [Навыки]({site_url}/skills), [Эффекты]({site_url}/abnormals),
  [Торговцы]({site_url}/merchants), [Сундуки]({site_url}/chests),
  [Квесты]({site_url}/quests), [Крафт]({site_url}/craft_list),
  [Древо навыков]({site_url}/skill_tree), [Куклы]({site_url}/doll),
  [Слуги]({site_url}/servants)

## Детальные страницы

- Предмет: {site_url}/item/{{IID}} — характеристики, крафт, дроп, связанные навыки
- Монстр: {site_url}/monster/{{MID}} — статы, дроп, споты возрождения
- Навык: {site_url}/skill/{{SID}}
- Эффект: {site_url}/abnormal/{{AID}}
- Торговец: {site_url}/merchant/{{ListID}} — ассортимент и цены
- Слуга: {site_url}/servant/{{IID}}

## JSON API (read-only, без авторизации)

Дополнительные данные детальных страниц, отдаются как JSON:

- {site_url}/api/item/{{IID}}/craft — рецепт крафта предмета
- {site_url}/api/item/{{IID}}/craft-need — где предмет используется в крафте
- {site_url}/api/item/{{IID}}/skill — навыки, которые даёт предмет
- {site_url}/api/item/{{IID}}/abnormal — эффекты предмета
- {site_url}/api/item/{{IID}}/bead-hole, /bead-rune, /bead-module — руны и сферы

Пожалуйста, не делайте массовых обходов JSON API: у сервера скромные ресурсы.
Для полной выгрузки структурированных данных лучше использовать исходную базу:
https://github.com/Aksel911/R2-HTML-DB
"""


@bp.route('/llms.txt')
def llms():
    body = LLMS_TXT.format(site_url=current_app.config['SITE_URL'])
    return Response(body, mimetype='text/plain')
