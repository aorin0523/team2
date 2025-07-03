from datetime import datetime, timedelta, timezone
from typing import Union
import os

from fastapi import Depends, APIRouter, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JOSEError
from pydantic import BaseModel, EmailStr
from modules.db.users import Users

# 環境変数から設定を取得
SECRET_KEY = os.getenv("BACKEND_SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter()

# OAuth2スキーム (SwaggerUIのAuthorizeボタンで使用)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/token")

# Pydanticモデル
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Union[str, None] = None

class UserResponse(BaseModel):
    id: str
    name: str
    email: str

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# JWTトークン作成
def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# 現在のユーザーを取得する依存関数
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JOSEError:
        raise credentials_exception
    
    users_db = Users()
    user = users_db.get_user_by_email(email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

# アクティブユーザーを取得する依存関数
async def get_current_active_user(current_user: dict = Depends(get_current_user)):
    return current_user

# ユーザー登録エンドポイント
@router.post("/register", response_model=dict)
async def register_user(user_data: UserRegister):
    """
    新規ユーザー登録
    """
    users_db = Users()
    
    # ユーザー作成
    result = users_db.create_user(
        name=user_data.name,
        email=user_data.email,
        password=user_data.password
    )
    
    if result["status"] == "ng":
        if "Email already exists" in result["error"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Registration failed {result['error']}"
            )
    
    return {
        "message": "User registered successfully",
        "user_id": result["user_id"]
    }

# ログインエンドポイント
@router.post("/login", response_model=Token)
async def login_user(user_data: UserLogin):
    """
    ユーザーログイン
    """
    users_db = Users()
    
    # ユーザー認証
    user = users_db.authenticate_user(user_data.email, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # アクセストークン作成
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    
    return Token(access_token=access_token, token_type="bearer")

# 現在のユーザー情報を取得
@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_active_user)):
    """
    現在のユーザー情報を取得
    """
    return UserResponse(
        id=current_user["id"],
        name=current_user["name"],
        email=current_user["email"]
    )
