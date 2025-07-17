from fastapi import APIRouter
from offers import offer

router = APIRouter(
    tags=["offers"]
)

router.include_router(offer.router)