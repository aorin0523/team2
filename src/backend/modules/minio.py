from minio import Minio
from minio.error import S3Error
import io, os

minio_client = Minio(
    os.getenv("MINIO_CONTAINER_ADDRESS"),
    access_key=os.getenv("MINIO_ROOT_USER"),
    secret_key=os.getenv("MINIO_ROOT_PASSWORD"),
    secure=False,
)

# 返り値をどうするか悩み中↓

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
    
def download_file(file_name: str, bucket_name: str = "storage"):
    """
    # MinIOからファイルをダウンロードする関数

    :param file_name: ダウンロードするファイルの名前
    :param bucket_name: ダウンロード元のバケット名, 基本はtempかstorageを指定すること

    :return: ファイルの内容(バイナリデータ)とコンテンツタイプ
    """
    try:
        response = minio_client.get_object(bucket_name, file_name)
        content = response.read()
        content_type = minio_client.stat_object(bucket_name, file_name).content_type
        return {"status": "ok", "content": content, "content_type": content_type}
    except S3Error as exc:
        return {"status": "error", "message": str(exc)}

def copy_file(source_bucket: str, source_file: str, dest_bucket: str, dest_file: str):
    """
    # MinIO内でファイルをコピーする関数

    :param source_bucket: コピー元のバケット名
    :param source_file: コピー元のファイル名
    :param dest_bucket: コピー先のバケット名
    :param dest_file: コピー先のファイル名

    :return: コピー結果のステータス
    """
    try:
        # ソースファイルをダウンロード
        download_result = download_file(source_file, source_bucket)
        if download_result["status"] != "ok":
            return download_result
        
        # 宛先バケットにアップロード
        upload_result = upload_file(
            bucket_name=dest_bucket,
            file_name=dest_file,
            file_content_type=download_result["content_type"],
            file_content=download_result["content"]
        )
        
        return upload_result
    except S3Error as exc:
        return {"status": "error", "message": str(exc)}
