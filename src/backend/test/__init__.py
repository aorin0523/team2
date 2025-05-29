from fastapi import APIRouter
from test import test

router = APIRouter(
    prefix="/test",
    tags=["test"],
)

router.include_router(test.router)