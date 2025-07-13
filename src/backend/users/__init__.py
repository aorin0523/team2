from fastapi import APIRouter
from . import user

router = APIRouter(
    tags=["users"]
)

router.include_router(user.router)