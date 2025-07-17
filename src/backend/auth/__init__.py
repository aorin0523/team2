from fastapi import APIRouter
from auth import token, auth_db

router = APIRouter(
    tags=["auth"],
)

# 既存のモックデータ認証
router.include_router(token.router)

# 新しいDB認証エンドポイント
router.include_router(auth_db.router)
