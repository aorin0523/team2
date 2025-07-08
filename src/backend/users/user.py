from fastapi import APIRouter, Request, FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from modules.db.users import Users

router = APIRouter()

from pydantic import BaseModel
class UserCreate(BaseModel):
    name: str
    email: str
    password: str

# 初期値はNone(受け取った項目のみ更新する)
class UserUpdate(BaseModel):
    name: str = None
    email: str = None
    password: str = None
    rank: int = None

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