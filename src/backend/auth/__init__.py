from fastapi import APIRouter
from auth import token

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

router.include_router(token.router)
