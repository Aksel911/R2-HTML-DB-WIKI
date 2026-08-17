from dataclasses import dataclass, field
from typing import Dict, Optional
from flask import current_app
from services.utils import clean_description

# slots=True: экономия памяти на экземплярах (см. models/item.py)

@dataclass(slots=True)
class Skill:
    """Data class for skills"""
    sid: int
    name: str
    desc: str
    hit_plus: int
    mp_per_use: int
    skill_type: int
    type_desc: str
    hp_per_use: int
    chao_use: int
    apply_radius: int
    apply_race: int
    casting_delay: int
    consume_item: int
    active_type: int
    animation: str
    casting_speed: int
    skill_effect: int
    cool_time: int
    consume_item2: int
    consume_item_cnt2: int
    item_id: Optional[int]
    item_pic: Optional[str]
    item_name: Optional[str]
    item_use_level: Optional[int]
    item_use_class: Optional[str]
    skill_pack_id: Optional[int]
    skill_pack_desc: Optional[str]
    abnormal_type_pic: Optional[str]
    abnormal_data: Optional[Dict[str, any]] = field(default_factory=dict)
    module_data: Optional[Dict[str, any]] = field(default_factory=dict)
    abnormal_type_data: Optional[Dict[str, any]] = field(default_factory=dict)

    def __post_init__(self):
        # Clean descriptions
        self.desc = clean_description(self.desc)
        self.item_name = clean_description(self.item_name) if self.item_name else ''
        self.skill_pack_desc = clean_description(self.skill_pack_desc)

        # Process item_use_class
        if self.item_use_class:
            self.item_use_class = f"{current_app.config['GITHUB_URL']}class/{self.item_use_class}.png"
        else:
            self.item_use_class = f"{current_app.config['GITHUB_URL']}class/0.png"

        # Handle item_pic
        if hasattr(self.item_pic, 'file_path'):
            self.item_pic = self.item_pic.file_path

        # Clean abnormal data
        if self.abnormal_data:
            self.abnormal_data = {
                key: (clean_description(value) if isinstance(value, str) else value)
                for key, value in self.abnormal_data.items()
            }

        # Clean module data
        if self.module_data and "params" in self.module_data:
            self.module_data["params"] = [
                {
                    "name": clean_description(param.get("name", "")),
                    "value": param.get("value", None)
                }
                for param in self.module_data["params"]
            ]
            


@dataclass(slots=True)
class DT_Attribute:
    """Data class for beads"""
    AttrbuteID: int
    AType: int
    AName: str
    ALevel: int
    ADiceDamage: int
    ADamage: int
    

@dataclass(slots=True)
class DT_SkillSlain:
    SlainID: int
    SType: int
    SName: str
    SLevel: int
    SHitPlus: int
    SDDPlus: int
    SRHitPlus: int
    SRDDPlus: int