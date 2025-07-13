from fastapi import APIRouter
from users import user

router = APIRouter(
    tags=["users"]
)

router.include_router(user.router)