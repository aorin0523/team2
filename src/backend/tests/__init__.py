from fastapi import APIRouter
from tests import test

router = APIRouter(
    tags=["test"],
)

router.include_router(test.router)
