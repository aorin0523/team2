from fastapi import APIRouter
from enterprises import enterprise

router = APIRouter(
    prefix="/enterprises",
    tags=["enterprises"],
)

router.include_router(enterprise.router)
