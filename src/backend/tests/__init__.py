from fastapi import APIRouter
from tests import test

router = APIRouter(
    prefix="/test",
    tags=["test"],
)

router.include_router(test.router)
