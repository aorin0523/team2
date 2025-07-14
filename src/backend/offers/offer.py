from fastapi import APIRouter, Request, FastAPI, File, UploadFile, Depends, HTTPException, HTTPException
from fastapi.responses import StreamingResponse
from modules.db.offers import Offers
from auth.token import get_current_enterprise_user, User


router = APIRouter()

from pydantic import BaseModel
class offerCreate(BaseModel):
    enterprise_id: str
    title: str
    content: str
    rank: int
    skills: list
    deadline: str
    salary: str = None
    capacity: int = None

# 初期値はNone(受け取った項目のみ更新する)
class OfferUpdate(BaseModel):
    title: str
    content: str
    rank: int
    skill: list

@router.get("/all")
async def read_all_offers():
    print("offer")
    """
    ユーザ情報を全件取得するエンドポイント
    """
    return Offers().read_all_offers()

@router.get("/skills")
async def get_all_skills():
    """
    全スキル一覧を取得するエンドポイント
    """
    result = Offers().get_all_skills()
    if result["status"] == "ok":
        return {"status": "success", "skills": result["skills"]}
    else:
        raise HTTPException(status_code=500, detail=result["error"])


# 企業ユーザー専用エンドポイント - /{offer_id}より前に配置
@router.get("/my")
async def get_my_offers(current_user: User = Depends(get_current_enterprise_user)):
    """
    ログイン中の企業ユーザーが作成したオファー一覧を取得
    """
    offers_db = Offers()
    return offers_db.get_offers_by_enterprise(current_user.enterprise_id)


@router.get("/{offer_id}")
async def read_offer(offer_id: str):
    print("offer")
    """
    ユーザ情報を全件取得するエンドポイント
    """
    return Offers().read_offers(offer_id)


@router.post("/")
async def create_offer(data: offerCreate):
    print("offer")
    """
    ユーザ情報を全件取得するエンドポイント
    """
    return Offers().create_offer(enterprise_id=data.enterprise_id, title=data.title, content=data.content, rank=data.rank, skills=data.skills)

@router.put("/{offer_id}")
async def update_offer(offer_id: str, data: OfferUpdate):
    """
    オファーを更新するエンドポイント
    """
    return Offers().update_offer(offer_id, title=data.title, content=data.content, rank=data.rank, skills=data.skill)

@router.delete("/{offer_id}")
async def update_offer(offer_id: str):
    """
    オファーを更新するエンドポイント
    """
    return Offers().delete_offer(offer_id)

@router.post("/my")
async def create_my_offer(data: offerCreate, current_user: User = Depends(get_current_enterprise_user)):
    """
    ログイン中の企業ユーザーが新しいオファーを作成
    """
    # 現在のユーザーのenterprise_idを使用してオファーを作成
    result = Offers().create_offer(
        enterprise_id=current_user.enterprise_id, 
        title=data.title, 
        content=data.content, 
        rank=data.rank, 
        skills=data.skills,
        salary=data.salary,
        capacity=data.capacity,
        deadline=data.deadline
    )
    
    if result["status"] == "ok":
        return {"status": "success", "offer_id": result["offer_id"]}
    else:
        raise HTTPException(status_code=500, detail=result["error"])