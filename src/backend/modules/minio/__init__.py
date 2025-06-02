from minio import Minio
from minio.error import S3Error
import io, os

minio_client = Minio(
    os.getenv("MINIO_CONTAINER_ADDRESS"),
    access_key=os.getenv("MINIO_ROOT_USER"),
    secret_key=os.getenv("MINIO_ROOT_PASSWORD"),
    secure=False,
)

def upload_file(bucket_name: str, file_name: str, file_content_type: str, file_content: bytes):
    """
    # MinIOにファイルをアップロードする関数

    **基本的にMinIOにアップロードする際はこの関数を使うこと**

    :param bucket_name: アップロード先のバケット名, 基本はtempかstorageを指定すること
    :param file_name: アップロードするファイルの名前, '/'を入れるとフォルダ構造が作成される
    :param file_content_type: ファイルのコンテンツタイプ
    :param file_content: アップロードするファイルの内容(バイナリデータ)

    :return: アップロード結果のステータス, "ok" or "error"でerrorの場合はmessageにエラーメッセージが入る
    """
    if not bucket_name or not file_name or not file_content_type or not file_content:
        return {"status": "error", "message": "Invalid parameters"}
    
    try:
        # バケットが存在しない場合は作成
        if not minio_client.bucket_exists(bucket_name):
            minio_client.make_bucket(bucket_name)
        # アップロード
        minio_client.put_object(
            bucket_name,
            file_name,
            io.BytesIO(file_content),
            length=len(file_content),
            content_type=file_content_type,
        )
        return {"status": "ok"}
    except S3Error as exc:
        return {"status": "error", "message": str(exc)}