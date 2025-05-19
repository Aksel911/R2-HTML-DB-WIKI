from dataclasses import dataclass
from typing import Dict, Optional

@dataclass
class Monster:
    """Data class for monsters"""
    MID: int
    MName: str
    mLevel: int
    MClass: str
    MExp: int
    MHIT: float
    MMinD: float
    MMaxD: float
    MAttackRateOrg: float
    MMoveRateOrg: float
    MAttackRateNew: float
    MMoveRateNew: float
    MHP: int
    MMP: int
    MMoveRange: float
    MGbjType: int
    MRaceType: int
    MAiType: int
    MCastingDelay: int
    MChaotic: int
    MSameRace1: int
    MSameRace2: int
    MSameRace3: int
    MSameRace4: int
    mSightRange: float
    mAttackRange: float
    mSkillRange: float
    mBodySize: float
    mDetectTransF: bool
    mDetectTransP: bool
    mDetectChao: bool
    mAiEx: int
    mScale: float
    mIsResistTransF: int
    mIsEvent: bool
    mIsTest: bool
    mHPNew: int
    mMPNew: int
    mBuyMerchanID: int
    mSellMerchanID: int
    mChargeMerchanID: int
    mTransformWeight: float
    mNationOp: int
    mHPRegen: float
    mMPRegen: float
    IContentsLv: int
    mIsEventTest: bool
    mIsShowHp: bool
    mSupportType: int
    mVolitionOfHonor: int
    mWMapIconType: int
    mIsAmpliableTermOfValidity: bool
    mAttackType: int
    mTransType: int
    mDPV: float
    mMPV: float
    mRPV: float
    mDDV: float
    mMDV: float
    mRDV: float
    mSubDDWhenCritical: float
    mEnemySubCriticalHit: float
    mEventQuest: bool
    mEScale: float

    # DT_MonsterResource
    RFileName: Optional[str] = None
    
    # def to_dict(self) -> Dict:
    #     """Convert monster to dictionary with formatted fields"""
    #     return {
    #         "MID": self.MID,
    #         "MName": self.MName.replace('/n', ' '),
    #         "MClass": self.MClass,
    #         "MLevel": self.MLevel,
    #         "MHP": self.MHP,
    #         "MMP": self.MMP,
    #         "mExp": self.MExp,
    #         "mRaceType": self.mRaceType,
    #         "mIsShowHp": 'Да' if self.mIsShowHp else 'Нет',
    #         "MChaotic": self.MChaotic,
    #         "mDetectTransF": 'Да' if self.mDetectTransF else 'Нет',
    #         "mDetectTransP": 'Да' if self.mDetectTransP else 'Нет',
    #         "mDetectChao": self.mDetectChao,
    #         "mIsResistTransF": 'Да' if self.mIsResistTransF == 1 else 'Нет'
    #     }


@dataclass
class DT_MonsterResource:
    """Data class for monster resources"""
    RFileName: str

@dataclass
class DT_MonsterAbnormalResist:
    """Data class for monster abnormal resist"""
    MID: int
    MName: str
    AID: int
    ADesc: str
    AType: int
    ATypeDesc: str 
    SID: int
    SName: str
    mSPID: int
    SkillPackName: str
    SkillPackDesc: str
    mSpriteFile: str
    mSpriteX: int
    mSpriteY: int
    


@dataclass
class DT_MonsterAttributeAdd:
    AID: int
    AType: int
    AName: str
    ALevel: int
    ADiceDamage: int
    ADamage: int
    
    
@dataclass
class DT_MonsterAttributeResist:
    AID: int
    AType: int
    AName: str
    ALevel: int
    ADiceDamage: int
    ADamage: int
    


@dataclass
class DT_MonsterProtect:
    SID: int
    ProtectSID: int
    SName: str
    SLevel: int
    SDPV: int
    SMPV: int
    SRPV: int
    SDDV: int
    SMDV: int
    SRDV: int

@dataclass
class DT_MonsterSlain:
    SID: int
    SType: int
    SName: str
    SLevel: int
    SHitPlus: int
    SDDPlus: int
    SRHitPlus: int
    SRDDPlus: int