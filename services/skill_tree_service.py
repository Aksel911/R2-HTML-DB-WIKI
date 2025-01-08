from services.database import execute_query
from services.utils import get_skill_icon_path, get_item_pic_url

# Main
def get_skill_nodes(tree_id):
    """Получение узлов дерева"""
    query = """
    SELECT DISTINCT
        n.mSTNID, n.mSTID, n.mMaxLevel,
        n.mIconSlotX, n.mIconSlotY,
        n.mLineN, n.mLineE, n.mLineS, n.mLineW,
        i.mSTNIID, p.mSPID,
        p.mName, p.mDesc,
        p.mSpriteFile, p.mSpriteX, p.mSpriteY
    FROM DT_SkillTreeNode n
    JOIN DT_SkillTreeNodeItem i ON n.mSTNID = i.mSTNID
    JOIN DT_SkillPack p ON i.mSPID = p.mSPID
    WHERE n.mSTID = ?
    """

    nodes = execute_query(query, (tree_id,))
    return [
        {
            'id': node.mSTNID,
            'treeId': node.mSTID,
            'maxLevel': node.mMaxLevel,
            'initialPoints': 0,
            'position': {
                'x': node.mIconSlotX,
                'y': node.mIconSlotY
            },
            'arrows': {
                'north': bool(node.mLineN),
                'east': bool(node.mLineE),
                'south': bool(node.mLineS),
                'west': bool(node.mLineW)
            },
            'skill': {
                'id': node.mSPID,
                'name': node.mName,
                'description': node.mDesc,
                'iconUrl': get_skill_icon_path(node.mSpriteFile, node.mSpriteX, node.mSpriteY)
            },
            'requirements': get_skill_requirements(node.mSTNID),
            'levels': get_skill_levels(node.mSTNID)
        }
        for node in nodes
    ]


# ToolTip
def get_skill_levels(stnid):
    """Получение уровней скилла"""
    query = """
    SELECT
        a.mSTNIID,
        b.mName,
        b.mSPID,
        b.mDesc,
        c.mTermOfValidity,
        --b.mIType,
        b.mUseLevel,
        
        e.SID,
        --e.SName,
        e.mActiveType
        
    FROM
        DT_SkillTreeNodeItem a
        JOIN DT_SkillPack AS b ON (a.mSPID = b.mSPID)
        JOIN DT_SkillTreeNode AS c ON (c.mSTNID = a.mSTNID)
        
        INNER JOIN DT_SkillPackSkill AS d ON (d.mSPID = b.mSPID)
        INNER JOIN DT_Skill as e on (d.mSID = e.SID)
        
    WHERE
        a.mSTNID = ?
    ORDER BY
        b.mSPID
        --e.mActiveType
    """

    levels = execute_query(query, (stnid,))
    result = []
    for level in levels:
        modified_name = level.mName.replace('ур. 1', '').replace('ур.1', '').strip()
        if modified_name != level.mName:
            result.append({
                'id': level.mSTNIID,
                'name': modified_name,
                'skillId': level.mSPID,
                'description': level.mDesc,
                'validity_time': level.mTermOfValidity,
                'use_level': level.mUseLevel,
                'sid_id': level.SID,
                'skill_active_or_no': level.mActiveType
                
                
            })
        result.append({
            'id': level.mSTNIID,
            'name': level.mName,
            'skillId': level.mSPID,
            'description': level.mDesc,
            'validity_time': level.mTermOfValidity,
            'use_level': level.mUseLevel,
            'sid_id': level.SID,
            'skill_active_or_no': level.mActiveType
        })
    return result


# Логика прокачки
def get_skill_requirements(stnid):
    """Получение требований скилла"""
    query = """
SELECT
  c.mSTNICType,
  c.mParamA,
  c.mParamB,
  c.mParamC,
  i2.mSTNID AS parent_skill_id,
  p2.mName AS parent_skill_name,
  t.mName AS tree_name,
  csn.mIconSlotY AS parent_row,
  n.mIconSlotY AS current_row,
  p.mName AS current_skill_name,
  i2.mLevel AS parent_level
FROM
  DT_SkillTreeNodeItemCondition c
  LEFT JOIN DT_SkillTreeNodeItem i ON c.mSTNIID = i.mSTNIID
  LEFT JOIN DT_SkillTreeNodeItem i2 ON c.mParamA = i2.mSTNIID
  LEFT JOIN DT_SkillPack p2 ON i2.mSPID = p2.mSPID
  LEFT JOIN TP_SkillTree t ON c.mParamA = t.mSTID
  LEFT JOIN DT_SkillTreeNode n ON i.mSTNID = n.mSTNID
  LEFT JOIN DT_SkillTreeNode csn ON i2.mSTNID = csn.mSTNID
  LEFT JOIN DT_SkillPack p ON i.mSPID = p.mSPID 
WHERE
  i.mSTNID = ?
    """

    results = execute_query(query, (stnid,))
    requirements = []

    for row in results:
        if '. 0' in row.current_skill_name:
            parent_row = next(
                (r.parent_row for r in results 
                 if r.current_skill_name.replace('ур. 1', '').strip() == row.current_skill_name.replace('. 0', '').strip()),
                None
            )
            if parent_row:
                requirements.append({
                    'type': 'skill',
                    'skillId': row.parent_skill_id,
                    'skillName': row.parent_skill_name,
                    'requiredLevel': 1,
                    'parentRow': parent_row,
                    'parent_level': row.parent_level
                })
        else:
            match row.mSTNICType:
                case 1:
                    requirements.append({
                        'type': 'skill',
                        'skillId': row.parent_skill_id,
                        'skillName': row.parent_skill_name,
                        'requiredLevel': 1,
                        'parentRow': row.parent_row,
                        'parent_level': row.parent_level
                    })
                case 2:
                    requirements.append({
                        'type': 'points',
                        'treeId': row.mParamA,
                        'treeName': row.tree_name,
                        'requiredPoints': row.mParamB,
                        'previousRowPoints': row.mParamC
                    })
                case 5:
                    requirements.append({
                        'type': 'exp',
                        'requiredExp': row.mParamA
                    })

    return requirements



# Питомцы
# def get_pets_skill_nodes():
#     query = """
#     SELECT
#         a.IID,-- Айди питомца
#         b.IName,-- Название питомца
#         a.SStep,-- 스킬트리 그룹 순서
#         a.STID1,-- Айди первого древа
#         a.STID2,-- Айди второго древа
#         a.STID3 -- Айди третьего древа
        
#     FROM
#         [dbo].[TblServantSkillTree] AS a
#     INNER JOIN DT_Item AS b ON ( a.IID = b.IID ) 
#     ORDER BY
#         a.IID
#     """

#     pet_nodes = execute_query(query)
#     return [
#         {
#             'pet_id': pet_node.IID,
#             'pet_picture': get_item_pic_url(pet_node.IID),
#             'pet_name': pet_node.IName,
#             'pet_grade': pet_node.SStep,
#             'pet_node_list': {
#                 'pet_STID1': pet_node.STID1,
#                 'pet_STID2': pet_node.STID2,
#                 'pet_STID3': pet_node.STID3
#             }
#         }
#         for pet_node in pet_nodes
#     ]