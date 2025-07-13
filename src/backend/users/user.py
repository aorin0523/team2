from fastapi import APIRouter, Request, FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from modules.db.users import Users
from modules.db.user_offers import UserOffers

router = APIRouter()

from pydantic import BaseModel
class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class EnterpriseUserCreate(BaseModel):
    name: str
    email: str
    password: str
    enterprise_id: str
    rank: int = 1

# 初期値はNone(受け取った項目のみ更新する)
class UserUpdate(BaseModel):
    name: str = None
    email: str = None
    password: str = None
    rank: int = None

class UserOfferApply(BaseModel):
    user_id: str
    offer_id: str

@router.get("/all")
async def read_all_users():
    """
    ユーザ情報を全件取得するエンドポイント
    """
    return Users().get_all_users()

@router.get("/{user_id}")
async def read_user(user_id: str):
    """
    ユーザ情報を取得するエンドポイント
    """
    return Users().get_users(id=user_id)

@router.post("/")
async def create_user(data: UserCreate):
    """
    ユーザーを登録するエンドポイント
    """
    return Users().create_user(
            name=data.name,
            email=data.email,
            password=data.password
        )

@router.post("/enterprise")
async def create_enterprise_user(data: EnterpriseUserCreate):
    """
    企業ユーザーを登録するエンドポイント
    """
    return Users().create_enterprise_user(
        name=data.name,
        email=data.email,
        password=data.password,
        enterprise_id=data.enterprise_id,
        rank=data.rank
    )

@router.put("/{user_id}")
async def update_user(user_id: str, data: UserUpdate):
    """
    ユーザ情報を更新するエンドポイント
    """
    return Users().update_user(
        id=user_id,
        name=data.name,
        email=data.email,
        password=data.password,
        rank=data.rank
    )

@router.delete("/{user_id}")
async def delete_user(user_id: str):
    """
    ユーザ情報を削除するエンドポイント
    """
    return Users().delete_user(id=user_id)

# UserOffersのエンドポイント
@router.post("/apply")
async def apply_to_offer(data: UserOfferApply):
    """
    ユーザーが求人に応募するエンドポイント
    """
    try:
        result = UserOffers().apply_to_offer(data.user_id, data.offer_id)
        if result:
            return {"status": "success", "message": "応募が完了しました"}
        else:
            raise HTTPException(status_code=400, detail="応募に失敗しました")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}/applications")
async def get_user_applications(user_id: str):
    """
    ユーザーの応募履歴を取得するエンドポイント
    """
    try:
        applications = UserOffers().get_user_applications(user_id)
        return {"status": "success", "applications": applications}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}/offer/{offer_id}/status")
async def check_application_status(user_id: str, offer_id: str):
    """
    ユーザーが特定の求人に応募済みかチェックするエンドポイント
    """
    try:
        status = UserOffers().check_application_status(user_id, offer_id)
        return {"status": "success", "applied": status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))