from datetime import datetime, timedelta, timezone
from typing import Union
import os

from fastapi import Depends, APIRouter, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JOSEError
from passlib.context import CryptContext
from pydantic import BaseModel
from modules.db.users import Users

SECRET_KEY = os.getenv("BACKEND_SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Union[str, None] = None


class User(BaseModel):
    id: str
    name: str
    email: str
    enterprise_id: Union[str, None] = None


class UserInDB(User):
    password: str


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/token")

router = APIRouter()


def get_user_by_email(email: str):
    """データベースからemailでユーザーを取得"""
    users_db = Users()
    user = users_db.get_user_by_email(email)
    if user:
        return UserInDB(
            id=user["id"],
            name=user["name"],
            email=user["email"],
            password=user["password"],
            enterprise_id=user.get("enterprise_id")
        )
    return None


def authenticate_user(email: str, password: str):
    """ユーザー認証（emailとpasswordで）"""
    users_db = Users()
    user = users_db.authenticate_user(email, password)
    if user:
        return UserInDB(
            id=user["id"],
            name=user["name"], 
            email=user["email"],
            password=user["password"],
            enterprise_id=user.get("enterprise_id")
        )
    return False


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        enterprise_id = payload.get("enterprise_id")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JOSEError:
        raise credentials_exception
    user = get_user_by_email(email=token_data.email)
    if user is None:
        raise credentials_exception
    return User(
        id=user.id, 
        name=user.name, 
        email=user.email,
        enterprise_id=user.enterprise_id
    )


async def get_current_active_user(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Token:
    """
    OAuth2 Password形式でのログイン (SwaggerUI Authorize用)
    
    注意: usernameフィールドにはemailアドレスを入力してください
    """
    print(f"Login attempt - Username: {form_data.username}")
    
    # usernameフィールドにemailが入力されることを想定
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        print(f"Authentication failed for email: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password (enter email in username field)",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"Authentication successful for user: {user.email}")
    print(f"Enterprise ID: {user.enterprise_id}")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # JWTにenterprise_idを含める
    token_data = {"sub": user.email}
    if user.enterprise_id:
        token_data["enterprise_id"] = user.enterprise_id
        token_data["is_enterprise"] = True
    else:
        token_data["is_enterprise"] = False
    
    access_token = create_access_token(
        data=token_data, expires_delta=access_token_expires
    )
    print (f"JWT: {access_token}")
    return Token(access_token=access_token, token_type="bearer")


@router.get("/users/me/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_active_user)):
    """現在のユーザー情報を取得（enterprise_id含む）"""
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "enterprise_id": current_user.enterprise_id,
        "is_enterprise": current_user.enterprise_id is not None
    }


@router.get("/users/me/items/")
async def read_own_items(current_user: User = Depends(get_current_active_user)):
    return [{"item_id": "Foo", "owner": current_user.email}]


# 企業ユーザー専用の認証依存関数
async def get_current_enterprise_user(current_user: User = Depends(get_current_active_user)):
    """企業ユーザーのみアクセス可能な依存関数"""
    if not current_user.enterprise_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Enterprise access required"
        )
    return current_user

# 一般ユーザー専用の認証依存関数
async def get_current_regular_user(current_user: User = Depends(get_current_active_user)):
    """一般ユーザーのみアクセス可能な依存関数"""
    if current_user.enterprise_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Regular user access required"
        )
    return current_user


@router.get("/enterprise/me")
async def get_enterprise_me(current_user: User = Depends(get_current_enterprise_user)):
    """企業ユーザー専用：現在のユーザー情報を取得"""
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "enterprise_id": current_user.enterprise_id,
        "is_enterprise": True
    }
