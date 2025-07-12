// API endpoint configuration
const getApiBaseUrl = () => {
  // Docker環境の場合
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // 開発環境ではlocalhost
  if (import.meta.env.DEV) {
    return 'http://localhost:8000';
  }
  
  // フォールバック
  return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();
export const API_ENDPOINTS = {
  // 認証
  LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
  REGISTER: `${API_BASE_URL}/api/v1/auth/register`,
  
  // オファー
  OFFERS_ALL: `${API_BASE_URL}/api/v1/offers/all`,
  OFFERS_MY_LIST: `${API_BASE_URL}/api/v1/offers/my/list`,
  OFFERS_MY_CREATE: `${API_BASE_URL}/api/v1/offers/my/create`,
  OFFERS_DETAIL: (id) => `${API_BASE_URL}/api/v1/offers/${id}`,
  OFFERS_DELETE: (id) => `${API_BASE_URL}/api/v1/offers/${id}`,
  
  // ユーザー
  USERS_PROFILE: `${API_BASE_URL}/api/v1/users/profile`,
  
  // 企業
  ENTERPRISES_PROFILE: `${API_BASE_URL}/api/v1/enterprises/profile`,
  
  // MinIO
  MINIO_UPLOAD_TEMP: `${API_BASE_URL}/api/v1/minio/upload/temp`,
  MINIO_DOWNLOAD: (bucket, filename) => `${API_BASE_URL}/api/v1/minio/download/${bucket}/${filename}`,
  MINIO_MOVE_TEMP_TO_STORAGE: (filename) => `${API_BASE_URL}/api/v1/minio/move/temp-to-storage/${filename}`,
  MINIO_LIST: (bucket) => `${API_BASE_URL}/api/v1/minio/list/${bucket}`,
  MINIO_DELETE: (bucket, filename) => `${API_BASE_URL}/api/v1/minio/delete/${bucket}/${filename}`,
};
