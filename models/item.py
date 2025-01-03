from dataclasses import dataclass
from os.path import splitext
from flask import current_app

@dataclass
class DT_Item:
    """Data class for items"""
    IID: int
    IName: str
    IType: int
    ILevel: int
    IDHIT: int
    IDDD: int
    IRHIT: int
    IRDD: int
    IMHIT: int
    IMDD: int
    IHPPlus: int
    IMPPlus: int
    ISTR: int
    IDEX: int
    IINT: int
    IMaxStack: int
    IWeight: float
    IUseType: int
    IUseNum: int
    IRecycle: int
    IHPRegen: int
    IMPRegen: int
    IAttackRate: int
    IMoveRate: int
    ICritical: int
    ITermOfValidity: int
    ITermOfValidityMi: int
    IDesc: str
    IStatus: int
    IFakeID: int
    IFakeName: str
    IUseMsg: str
    IRange: int
    IUseClass: str
    IDropEffect: int
    IUseLevel: int
    IUseEternal: bool
    IUseDelay: int
    IUseInAttack: bool
    IIsEvent: bool
    IIsIndict: bool
    IAddWeight: float
    ISubType: int
    IIsCharge: bool
    INationOp: int
    IPShopItemType: int
    IQuestNo: int
    IIsTest: bool
    IQuestNeedCnt: int
    IContentsLv: int
    IIsConfirm: bool
    IIsSealable: bool
    IAddDDWhenCritical: int
    mSealRemovalNeedCnt: int
    mIsPracticalPeriod: bool
    mIsReceiveTown: bool
    IIsReinforceDestroy: bool
    IAddPotionRestore: int
    IAddMaxHpWhenTransform: int
    IAddMaxMpWhenTransform: int
    IAddAttackRateWhenTransform: int
    IAddMoveRateWhenTransform: int
    ISupportType: int
    ITermOfValidityLv: int
    mIsUseableUTGWSvr: bool
    IAddShortAttackRange: int
    IAddLongAttackRange: int
    IWeaponPoisonType: int
    IDPV: int
    IMPV: int
    IRPV: int
    IDDV: int
    IMDV: int
    IRDV: int
    IHDPV: int
    IHMPV: int
    IHRPV: int
    IHDDV: int
    IHMDV: int
    IHRDV: int
    ISubDDWhenCritical: int
    IGetItemFeedback: int
    IEnemySubCriticalHit: int
    IIsPartyDrop: bool
    IMaxBeadHoleCount: int
    ISubTypeOption: int
    mIsDeleteArenaSvr: bool

    def __post_init__(self):
        # Преобразование URL класса
        self.IUseClass = f"{current_app.config['GITHUB_URL']}class/{self.IUseClass}.png"

@dataclass
class DT_ItemResource:
    """Data class for item resources"""
    ROwnerID: int
    RFileName: str
    RPosX: int
    RPosY: int

    def __post_init__(self):
        self.RFileName = splitext(self.RFileName)[0]
        self.file_path = (
            f"{current_app.config['GITHUB_URL']}"
            f"{self.RFileName}_{self.RPosX}_{self.RPosY}.png"
        )
        
@dataclass
class TblSpecificProcItem:
    """Data class for TblSpecificProcItem"""
    mIID: int
    IName: str
    mProcNo: int
    mProcDesc: str
    mAParam: int
    mAParamDesc: str
    mBParam: int
    mBParamDesc: str
    mCParam: int
    mCParamDesc: str
    mDParam: int
    mDParamDesc: str


@dataclass
class DT_ItemAbnormalResist:
    """Data class for item abnormal resist"""
    IID: int
    IName: str
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
class DT_Bead:
    """Data class for beads"""
    mBeadNo: int
    mBeadName: str
    mBeadType: int
    mBeadTypeDesc: str
    mChkGroup: str
    mPercent: float
    mApplyTarget: str
    mParamA: float
    mParamADesc: str
    mParamB: float
    mParamBDesc: str
    mParamC: float
    mParamCDesc: str
    mParamD: float
    mParamDDesc: str
    mParamE: float
    mParamEDesc: str
    mTargetIPos: str
    mProb: float
    mGroup: int
    mItemSubType: int
    mMaxHoleCount: int
    mHoleCount: int
    mHoleProb: float
    MID: int
    spid_data: list
    spid_image: str
    
    



@dataclass
class DT_ItemBeadModule:
    """Data class for beads"""
    MID: int
    MType: int
    MName: str
    MDesc: str
    MLevel: int
    MAParam: float
    MAParamName: str
    MBParam: float
    MBParamName: str
    MCParam: float
    MCParamName: str
    
    
@dataclass
class TblBeadHoleProb:
    """Data class for beads"""
    IName: str
    mMaxHoleCount: int
    mHoleCount: int
    mProb: float
    

@dataclass
class DT_ItemAttributeAdd:
    AID: int
    AType: int
    AName: str
    ALevel: int
    ADiceDamage: int
    ADamage: int
    
    
@dataclass
class DT_ItemAttributeResist:
    AID: int
    AType: int
    AName: str
    ALevel: int
    ADiceDamage: int
    ADamage: int
    

@dataclass
class DT_ItemProtect:
    PID: int
    SID: int
    SName: str
    SLevel: int
    SDPV: int
    SMPV: int
    SRPV: int
    SDDV: int
    SMDV: int
    SRDV: int

    

@dataclass
class DT_ItemSlain:
    SID: int
    SType: int
    SName: str
    SLevel: int
    SHitPlus: int
    SDDPlus: int
    SRHitPlus: int
    SRDDPlus: int
    

@dataclass
class DT_ItemPanalty:
    IUseClass: int
    PanaltyClassPic: str
    IDHIT: int
    IDDD: int
    IRHIT: int
    IRDD: int
    IMHIT: int
    IMDD: int
    IHPPlus: int
    IMPPlus: int
    ISTR: int
    IDEX: int
    IINT: int
    IHPRegen: int
    IMPRegen: int
    IAttackRate: int
    IMoveRate: int
    ICritical: int
    IRange: int
    IAddWeight: int
    IAddPotionRestore: int
    IDPV: int
    IMPV: int
    IRPV: int
    IDDV: int
    IMDV: int
    IRDV: int
    IHDPV: int
    IHMPV: int
    IHRPV: int
    IHDDV: int
    IHMDV: int
    IHRDV: int
    
