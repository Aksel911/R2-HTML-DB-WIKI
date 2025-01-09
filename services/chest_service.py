from typing import List, Dict, Optional, Set, Tuple
from flask import current_app
from services.database import execute_query
from services.item_service import get_item_name
from services.monster_service import get_monster_name
from services.utils import get_monster_pic_url, get_item_pic_url
import re
from datetime import datetime





# Получаем диалог скрипты по MID
def get_chest_script(chest_mid: int) -> Optional[str]:
    """Получаем диалог скрипты по MID"""
    try:
        query = "SELECT mScriptText FROM TblDialogScript WHERE mMId = ?"
        row = execute_query(query, (chest_mid,), fetch_one=True)
        return row[0] if row else None
    except Exception as e:
        print(f"Error getting chest script: {e}")
        return None

# Парсим диалог скрипты
def parse_script(script: str, chest_mid: int) -> List[Dict]:
    if not script:
        return [], None
        
    drops = []
    current_item = None
    item_pic = None
    total_chance = 10000
    
    chest_mid_mname = get_monster_name(chest_mid)
    chest_mid_pic = get_monster_pic_url(chest_mid)

    try:
        lines = [line.strip() for line in script.split('\n') if line.strip()]
        
        # Находим общий шанс
        for line in lines:
            if 'getlgrandom() %' in line:
                rand_match = re.search(r'getlgrandom\(\)\s*%\s*(\d+)', line)
                if rand_match:
                    total_chance = int(rand_match.group(1))
                    break
        
        for i, line in enumerate(lines):
            if 'pushitem2(' in line:
                match = re.search(r'pushitem2\((\d+),\s*(\d+),\s*\d+,\s*(\d+)\)', line)
                if match:
                    current_item = int(match.group(1))
                    count = int(match.group(2))
                    status = int(match.group(3))
                    
                    # Ищем шанс в предыдущей строке
                    if i > 0:  # Проверяем, что есть предыдущая строка
                        prev_line = lines[i-1].strip()
                        if 'rand <=' in prev_line:
                            chance_match = re.search(r'rand <= (\d+)', prev_line)
                            if chance_match:
                                chance = int(chance_match.group(1))
                                
                                item_name = get_item_name(current_item)
                                item_pic = get_item_pic_url(current_item)
                                
                                drops.append({
                                    'MID': chest_mid,
                                    'MID_pic': chest_mid_pic,
                                    'MName': chest_mid_mname,
                                    'item_id': current_item,
                                    'item_name': item_name,
                                    'item_pic': item_pic,
                                    'count': count,
                                    'status': status,
                                    'drop_chance': chance,
                                    'total_chance': total_chance
                                })

        # Сортируем по шансу от большего к меньшему
        drops.sort(key=lambda x: x['drop_chance'], reverse=True)
        return drops, item_pic
        
    except Exception as e:
        print(f"Error parsing script for chest {chest_mid}: {e}")
        print(f"Script content: {script}")
        return [], None
   

def analyze_drops(mid: int) -> Tuple[List[Dict], Optional[str]]:
    """Анализ дропа из сундука"""
    #print(f"\nАнализ содержимого сундука для MID: {mid}\n")
    try:
        # Получаем скрипт
        script = get_chest_script(mid)
        if not script:
            print(f"No script found for chest {mid}")
            return [], None
            
        # Парсим скрипт
        drops, item_pic = parse_script(script, mid)
        if not drops:
            print(f"No drops found in script for chest {mid}")
            return [], None
            
        return drops, item_pic
        
    except Exception as e:
        print(f"Error analyzing drops for chest {mid}: {e}")
        return [], None

    
# * [929, 2578] # MID NPC (Золотой: 929, Изумрудный: 2578)
def get_chest_route_call(chest_mids: List[int]) -> Tuple[List[Dict], Set[str]]:
    """Получение данных о сундуках"""
    all_data = []
    all_item_pics = set()
    
    for mid in chest_mids:
        try:
            data, item_pic = analyze_drops(mid)
            if data and item_pic:  # Проверяем что получили данные
                all_data.extend(data)
                all_item_pics.add(item_pic)
        except Exception as e:
            print(f"Error processing chest {mid}: {e}")
            continue  # Продолжаем со следующим сундуком
    
    # Если вообще нет данных, возвращаем пустые структуры
    if not all_data:
        return [], set()
        
    return all_data, all_item_pics



def generate_dialog_script(items: List[Dict], main_chance: int) -> str:
    """Генерация скрипта диалога для сундука"""
    script = """var param menu
var int u_name
var int result
var int rand
var int rscnumber
var int check

if menu == 99
 script_exit()

elseif menu == 2
 if checkslot(2) == 0
  opendialog(13)
  script_exit()
 elseif checkweight(200) == 0
  opendialog(13)
  script_exit()
 endif

 if getitem(1622) < 1
  opendialog(11)
  script_exit()
 endif
 if getitem(1621) < 1
  opendialog(12)
  script_exit()
 endif

 if getitem(1622) > 0
  popitem(1622,1)
  popitem(1621,1)

  rand = getlgrandom() % 10000\n"""

    # Добавляем предметы
    for i, item in enumerate(items):
        if int(item['dropChance']) == 0:
            item['dropChance'] = 1
        
        #chance = int(float(item['dropChance']) * 100)  # Конвертируем проценты в базовые единицы
        chance = int(float(item['dropChance']) * 100)
        print(f"generate_dialog_script: {chance}, {item['dropChance'] }, {main_chance}")
        
        condition = "if" if i == 0 else "elseif"
        script += f"  {condition} rand <= {chance}\n"
        script += f"   result = pushitem2({item['itemId']},{item['count']},18,{item['status']})\n"

    script += """  else
   result = pushitem2(4900,10,18,1)
  endif
 endif

 opendialog(10)
 script_exit()

else
 opendialog(0,u_name)
 script_exit()
endif"""

    return script

def generate_dialog_gui(items: List[Dict]) -> str:
    """Генерация GUI диалога для сундука"""
    #print(f"Генерация GUI диалога для сундука: {items}")
    gui = """<GUIText ver=2>

<text no=0>
<p>&sp;Они говорят, что глупо полагаться на одну лишь удачу. Но разве в нашей жизни нет места чудесам?

Вы можете быть сколь угодно сильным и мудрым, но иногда все решает случай.

Если вы хотите испытать судьбу, попробуйте узнать, что находится внутри золотого сундука!

Если вам удастся его раздобыть, обращайтесь. Я помогу его открыть.&nl;&nl;</p>

<p color=FF99CC33 link=10>[Проверить содержимое золотого сундука]&nl;&nl;</p>
<p color=FFFF6600 link=9>[Узнать содержимое сундука]&nl;&nl;</p>
<p color=FF99CC33 link=21>[Пожертвовать]&nl;&nl;&nl;&nl;</p>
<p color=FF99CC33 act=0 val=99>[Завершить диалог]&nl;&nl;</p>
</text>

<text no=9>
"""

    for item in items:
        IStatus = item['status']
        padding = f'{IStatus}' + '0' * (7 - len(str(item['itemId'])))
        item_pic = f"<m width=16 height=16 value={padding}{item['itemId']}></m>"
        gui += f"{item_pic}<p>*3{item['itemName']}*5 {item['count']} шт.*9&nl;&nl;</p>\n"

    gui += """</text>

<text no=10>
<p>
К золотому сундуку подходит только ключ из чистого золота.

Мне необходим ключ от золотого сундука.

Другой ключ нам не подойдет.&nl;

*1Требуется: золотой сундук, 1 шт.&nl;
*1Требуется: ключ от золотого сундука, 1 шт.&nl;
</p>

<p color=FF99CC33 act=0 val=2>&nl;[Проверить содержимое золотого сундука]</p>
<p>&nl;&nl;</p>
<p color=FF99CC33 act=0 val=99>[Завершить диалог]</p>
</text>"""

    # Добавляем остальные тексты диалога
    gui += generate_additional_dialog_texts()
    #print(f"FFFFF {gui}")
    return gui

def generate_additional_dialog_texts() -> str:
    """Генерация дополнительных текстов диалога"""
    return """
<text no=11>
<p>
У вас не хватает необходимых предметов.&nl;

*1Требуется: золотой сундук, 1 шт.&nl;&nl;
</p>

<p color=FF99CC33 act=0 val=99>[Завершить диалог]</p>
</text>

<text no=12>
<p>
Не хватает ключа от золотого сундука...&nl;

*1Требуется: ключ от золотого сундука, 1 шт.&nl;&nl;
</p>

<p color=FF99CC33 act=0 val=99>[Завершить диалог]</p>
</text>

<text no=13>
<p>
В вашем инвентаре недостаточно свободного места, либо Вы перегружены.
</p>
</text>

<text no=21>
<p>
О... Моя благодарность не знает границ!.. Это такая честь, получить в дар *4золотой сундук с сокровищами*9.
Будьте уверены: чем больше пожертвований вы сделаете, тем скорее вам повезет.
</p>
</text>"""

def update_chest_database(mid: int, script_text: str, dialog_text: str) -> bool:
    """Обновление данных сундука в базе данных через удаление и вставку"""
    print(mid)
    try:
        # Удаляем старые записи и получаем количество удаленных строк
        deleted_script = execute_query(
            "DELETE FROM TblDialogScript WHERE mMId = ?", 
            (mid,)
        )
        print(f"Deleted {deleted_script} rows from TblDialogScript {mid}")
        # Вставляем новую запись в TblDialogScript
        inserted_script = execute_query("""
            INSERT INTO TblDialogScript (mMId, mScriptText, mRegDate, mUptDate)
            VALUES (?, ?, GETDATE(), GETDATE())
        """, (mid, script_text))
        
        # Удаляем из второй таблицы
        deleted_dialog = execute_query(
            "DELETE FROM TblDialog WHERE mMId = ?",
            (mid,)
        )
        
        # Вставляем в TblDialog
        inserted_dialog = execute_query("""
            INSERT INTO TblDialog (
                mMId, mClick, mRegDate, mUptDate,
                mDie, mAttacked, mTarget, mBear,
                mGossip1, mGossip2, mGossip3, mGossip4
            )
            VALUES (
                ?, ?, GETDATE(), GETDATE(),
                ',', ',', ',', ',',
                ',', ',', ',', ','
            )
        """, (mid, dialog_text))
        
        # Можно даже логировать результаты
        print(f"Script: deleted {deleted_script}, inserted {inserted_script} for {mid}")
        print(f"Dialog: deleted {deleted_dialog}, inserted {inserted_dialog} for {mid}")
        
        return True
        
    except Exception as e:
        print(f"Error updating chest database: {e}")
        return False
    
    
def update_chest_loot(mid: int, items: List[Dict], main_chance: int) -> bool:
    """Обновление содержимого сундука"""
    try:
        # Генерируем новые тексты
        script_text = generate_dialog_script(items, main_chance)
        dialog_text = generate_dialog_gui(items)
        
        # Обновляем базу данных
        success = update_chest_database(mid, script_text, dialog_text)
        
        return success
    except Exception as e:
        print(f"Error updating chest loot: {e}")
        return False
