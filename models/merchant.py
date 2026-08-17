class Merchant:
    # __slots__: список торговцев целиком лежит в TTL-кэше, без __dict__
    # экземпляр заметно легче. ItemCount проставляется после создания
    # (services/merchant_service.py), поэтому он тоже в слотах.
    __slots__ = (
        'ListID', 'MID', 'MName', 'MClass', 'ItemID',
        'IName', 'Price', 'mPaymentType', 'mIsEvent', 'ItemCount',
    )

    def __init__(
        self,
        ListID: int,
        MID: int,
        MName: str,
        MClass: int,
        ItemID: int,
        IName: str,
        Price: int,
        mPaymentType: int,
        mIsEvent: int,
        ItemCount: 0
    ):
        self.ListID = ListID
        self.MID = MID
        self.MName = MName
        self.MClass = MClass
        self.ItemID = ItemID
        self.IName = IName
        self.Price = Price
        self.mPaymentType = mPaymentType
        self.mIsEvent = mIsEvent
        self.ItemCount = ItemCount

    def __repr__(self):
        return f"Merchant(ListID={self.ListID}, MID={self.MID}, MName='{self.MName}')"