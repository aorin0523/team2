from fastapi import APIRouter
from offers import offer

router = APIRouter(
    prefix="/offers",
    tags=["offers"]
)

router.include_router(offer.router)