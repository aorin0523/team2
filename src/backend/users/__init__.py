from fastapi import APIRouter
from users import user

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

router.include_router(user.router)