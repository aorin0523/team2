from fastapi import APIRouter, Request, HTTPException, File, UploadFile
from fastapi.responses import StreamingResponse
import io
import uuid
from typing import Optional

from modules.minio import upload_file, download_file
from minio import Minio
from minio.error import S3Error
import os

router = APIRouter()

# MinIOクライアントの初期化
minio_client = Minio(
    os.getenv("MINIO_CONTAINER_ADDRESS"),
    access_key=os.getenv("MINIO_ROOT_USER"),
    secret_key=os.getenv("MINIO_ROOT_PASSWORD"),
    secure=False,
)

@router.post("/upload/temp")
async def upload_to_temp(request: Request, file: UploadFile = File(...)):
    """
    MinIOのtempバケットにファイルをアップロード
    
    Args:
        file: アップロードするファイル
        
    Returns:
        dict: アップロード結果とファイルのUUID
    """
    try:
        # ファイルの内容を読み取り
        content = await file.read()
        
        # ユニークなファイル名を生成
        file_uuid = str(uuid.uuid4())
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else ''
        file_name = f"{file_uuid}.{file_extension}" if file_extension else file_uuid
        
        # tempバケットにアップロード
        result = upload_file(
            bucket_name="temp",
            file_name=file_name,
            file_content_type=file.content_type,
            file_content=content
        )
        
        if result["status"] == "ok":
            return {
                "status": "success",
                "message": "ファイルがtempバケットにアップロードされました",
                "file_uuid": file_uuid,
                "file_name": file_name,
                "original_filename": file.filename,
                "content_type": file.content_type,
                "size": len(content)
            }
        else:
            raise HTTPException(status_code=500, detail=f"アップロードに失敗しました: {result['message']}")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ファイルのアップロードでエラーが発生しました: {str(e)}")

@router.get("/download/{bucket_name}/{file_name}")
async def download_from_minio(bucket_name: str, file_name: str):
    """
    MinIOからファイルをダウンロード
    storageバケットの場合、content-typeに基づいて拡張子を復元
    
    Args:
        bucket_name: バケット名（temp または storage）
        file_name: ダウンロードするファイル名
        
    Returns:
        StreamingResponse: ファイルの内容
    """
    try:
        # バケット名の検証
        if bucket_name not in ["temp", "storage"]:
            raise HTTPException(status_code=400, detail="無効なバケット名です。temp または storage を指定してください。")
        
        # ファイルをダウンロード
        result = download_file(file_name, bucket_name)
        
        if result["status"] == "ok":
            # content-typeに基づいて拡張子を決定
            def get_extension_from_content_type(content_type: str) -> str:
                content_type_map = {
                    'image/jpeg': '.jpg',
                    'image/jpg': '.jpg',
                    'image/png': '.png',
                    'image/gif': '.gif',
                    'image/webp': '.webp',
                    'image/bmp': '.bmp',
                    'image/svg+xml': '.svg',
                    'application/pdf': '.pdf',
                    'text/plain': '.txt',
                    'application/json': '.json',
                    'text/html': '.html',
                    'text/css': '.css',
                    'application/javascript': '.js'
                }
                return content_type_map.get(content_type, '')
            
            # storageバケットの場合は拡張子を復元
            if bucket_name == "storage":
                extension = get_extension_from_content_type(result["content_type"])
                download_filename = f"{file_name}{extension}"
            else:
                download_filename = file_name
            
            return StreamingResponse(
                io.BytesIO(result["content"]),
                media_type=result["content_type"],
                headers={"Content-Disposition": f"attachment; filename={download_filename}"}
            )
        else:
            raise HTTPException(status_code=404, detail=f"ファイルが見つかりません: {result['message']}")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ファイルのダウンロードでエラーが発生しました: {str(e)}")

@router.post("/move/temp-to-storage/{file_name}")
async def move_temp_to_storage(file_name: str, new_file_name: Optional[str] = None):
    """
    tempバケットからstorageバケットにファイルを移動
    拡張子を削除してstorageに保存し、content-typeは保持
    
    Args:
        file_name: 移動するファイル名
        new_file_name: 移動先での新しいファイル名（省略可）
        
    Returns:
        dict: 移動結果
    """
    try:
        # 移動先のファイル名を決定（拡張子を削除）
        if new_file_name:
            # 新しいファイル名から拡張子を削除
            target_file_name = new_file_name.split('.')[0] if '.' in new_file_name else new_file_name
        else:
            # 元のファイル名から拡張子を削除
            target_file_name = file_name.split('.')[0] if '.' in file_name else file_name
        
        # tempバケットからファイルをダウンロード
        temp_result = download_file(file_name, "temp")
        
        if temp_result["status"] != "ok":
            raise HTTPException(status_code=404, detail=f"tempバケットにファイルが見つかりません: {temp_result['message']}")
        
        # storageバケットにアップロード（拡張子なし、content-typeは維持）
        storage_result = upload_file(
            bucket_name="storage",
            file_name=target_file_name,
            file_content_type=temp_result["content_type"],
            file_content=temp_result["content"]
        )
        
        if storage_result["status"] != "ok":
            raise HTTPException(status_code=500, detail=f"storageバケットへのアップロードに失敗しました: {storage_result['message']}")
        
        # tempバケットからファイルを削除
        try:
            minio_client.remove_object("temp", file_name)
            temp_deleted = True
        except S3Error as e:
            temp_deleted = False
            print(f"Warning: tempバケットからのファイル削除に失敗しました: {str(e)}")
        
        return {
            "status": "success",
            "message": "ファイルがtempからstorageに移動されました（拡張子削除）",
            "source_file": file_name,
            "target_file": target_file_name,
            "content_type": temp_result["content_type"],
            "temp_deleted": temp_deleted
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ファイルの移動でエラーが発生しました: {str(e)}")

@router.get("/list/{bucket_name}")
async def list_files(bucket_name: str):
    """
    指定されたバケット内のファイル一覧を取得
    
    Args:
        bucket_name: バケット名（temp または storage）
        
    Returns:
        dict: ファイル一覧
    """
    try:
        # バケット名の検証
        if bucket_name not in ["temp", "storage"]:
            raise HTTPException(status_code=400, detail="無効なバケット名です。temp または storage を指定してください。")
        
        # バケットが存在するかチェック
        if not minio_client.bucket_exists(bucket_name):
            return {
                "status": "success",
                "bucket_name": bucket_name,
                "files": [],
                "message": f"{bucket_name}バケットが存在しません"
            }
        
        # ファイル一覧を取得
        objects = minio_client.list_objects(bucket_name, recursive=True)
        files = []
        
        for obj in objects:
            try:
                stat = minio_client.stat_object(bucket_name, obj.object_name)
                files.append({
                    "name": obj.object_name,
                    "size": obj.size,
                    "last_modified": obj.last_modified.isoformat() if obj.last_modified else None,
                    "content_type": stat.content_type if stat else None
                })
            except Exception as e:
                print(f"Warning: ファイル {obj.object_name} の情報取得に失敗しました: {str(e)}")
                files.append({
                    "name": obj.object_name,
                    "size": obj.size,
                    "last_modified": obj.last_modified.isoformat() if obj.last_modified else None,
                    "content_type": None
                })
        
        return {
            "status": "success",
            "bucket_name": bucket_name,
            "files": files,
            "count": len(files)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ファイル一覧の取得でエラーが発生しました: {str(e)}")

@router.delete("/delete/{bucket_name}/{file_name}")
async def delete_file(bucket_name: str, file_name: str):
    """
    指定されたバケットからファイルを削除
    
    Args:
        bucket_name: バケット名（temp または storage）
        file_name: 削除するファイル名
        
    Returns:
        dict: 削除結果
    """
    try:
        # バケット名の検証
        if bucket_name not in ["temp", "storage"]:
            raise HTTPException(status_code=400, detail="無効なバケット名です。temp または storage を指定してください。")
        
        # ファイルが存在するかチェック
        try:
            minio_client.stat_object(bucket_name, file_name)
        except S3Error as e:
            if e.code == "NoSuchKey":
                raise HTTPException(status_code=404, detail="ファイルが見つかりません")
            else:
                raise HTTPException(status_code=500, detail=f"ファイルの確認でエラーが発生しました: {str(e)}")
        
        # ファイルを削除
        minio_client.remove_object(bucket_name, file_name)
        
        return {
            "status": "success",
            "message": "ファイルが削除されました",
            "bucket_name": bucket_name,
            "file_name": file_name
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ファイルの削除でエラーが発生しました: {str(e)}")
