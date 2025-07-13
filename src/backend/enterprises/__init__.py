from fastapi import APIRouter
from enterprises import enterprise

router = APIRouter(
    tags=["enterprises"],
)

router.include_router(enterprise.router)
