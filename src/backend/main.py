import uvicorn
from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI()

# CORSの設定
app.add_middleware(SessionMiddleware, secret_key="kore_ha-secret-zyanne*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://frontend:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# root_routerを作成
root_router = APIRouter(prefix="/api/v1")

## 新しくモジュール(フォルダ)を追加したらここにインポートする
# 例: import user
import tests
import enterprises

# 新しくモジュールを作成したらここにインポートしたルーターを追加
# 例: root_router.include_router(user.router)

root_router.include_router(tests.router)
root_router.include_router(enterprises.router)


# root_routerをappにinclude
app.include_router(root_router)


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        reload=True,
    )