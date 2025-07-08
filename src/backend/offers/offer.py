from fastapi import APIRouter, Request, FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from modules.db.offers import Offers


router = APIRouter()

from pydantic import BaseModel
class offerCreate(BaseModel):
    enterprise_id: str
    title: str
    content: str
    rank: int
    skills: list
    deadline: str

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