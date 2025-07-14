from fastapi import APIRouter, Request, FastAPI, File, UploadFile, Depends
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
async def create_my_offer(data: dict, current_user: User = Depends(get_current_enterprise_user)):
    """
    ログイン中の企業ユーザーがオファーを作成
    """
    # enterprise_idを自動的に設定
    offer_data = offerCreate(
        enterprise_id=current_user.enterprise_id,
        title=data["title"],
        content=data["content"],
        rank=data["rank"],
        skills=data.get("skills", []),
        deadline=data.get("deadline"),
        salary=data.get("salary"),
        capacity=data.get("capacity")
    )
    
    offers_db = Offers()
    return offers_db.create_offer(
        enterprise_id=offer_data.enterprise_id,
        title=offer_data.title,
        content=offer_data.content,
        rank=offer_data.rank,
        skills=offer_data.skills,
        deadline=offer_data.deadline,
        salary=offer_data.salary,
        capacity=offer_data.capacity
    )