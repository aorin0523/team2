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
  OFFERS_ALL_PAGINATED: (page, limit, rank, userId, favoritesOnly) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (rank) params.append('rank', rank);
    if (userId) params.append('user_id', userId);
    if (favoritesOnly) params.append('favorites_only', 'true');
    return `${API_BASE_URL}/api/v1/offers/all?${params.toString()}`;
  },
  OFFERS_MY_LIST: `${API_BASE_URL}/api/v1/offers/my`,
  OFFERS_MY_CREATE: `${API_BASE_URL}/api/v1/offers/my`,
  OFFERS_DETAIL: (id) => `${API_BASE_URL}/api/v1/offers/${id}`,
  OFFERS_DELETE: (id) => `${API_BASE_URL}/api/v1/offers/${id}`,
  OFFERS_SKILLS: `${API_BASE_URL}/api/v1/offers/skills`,
  
  // ユーザー
  AUTH_ME: `${API_BASE_URL}/api/v1/auth/me`,
  USER_APPLY: `${API_BASE_URL}/api/v1/users/apply`,
  USER_APPLICATIONS: (userId) => `${API_BASE_URL}/api/v1/users/${userId}/applications`,
  USER_APPLICATION_STATUS: (userId, offerId) => `${API_BASE_URL}/api/v1/users/${userId}/offer/${offerId}/status`,
  USER_FAVORITE: `${API_BASE_URL}/api/v1/users/favorite`,
  USER_FAVORITES: (userId) => `${API_BASE_URL}/api/v1/users/${userId}/favorites`,
  USER_PROFILE: (userId) => `${API_BASE_URL}/api/v1/users/${userId}/profile`,
  USER_PROFILE_UPDATE: (userId) => `${API_BASE_URL}/api/v1/users/${userId}/profile`,
  USER_SKILLS_ALL: `${API_BASE_URL}/api/v1/users/skills/all`,
  USER_NOTIFICATIONS: (userId) => `${API_BASE_URL}/api/v1/users/${userId}/notifications`,
  USER_NOTIFICATIONS_UNREAD_COUNT: (userId) => `${API_BASE_URL}/api/v1/users/${userId}/notifications/unread-count`,
  MARK_NOTIFICATION_READ: (notificationId) => `${API_BASE_URL}/api/v1/users/notifications/${notificationId}/read`,
  MARK_ALL_NOTIFICATIONS_READ: (userId) => `${API_BASE_URL}/api/v1/users/${userId}/notifications/mark-all-read`,
  OFFER_APPLICATIONS_COUNT: (offerId) => `${API_BASE_URL}/api/v1/users/offer/${offerId}/applications/count`,
  OFFER_APPLICANTS: (offerId) => `${API_BASE_URL}/api/v1/users/offer/${offerId}/applicants`,
  
  // 企業
  ENTERPRISES_PROFILE: `${API_BASE_URL}/api/v1/enterprises/profile`,
  
  // MinIO
  MINIO_UPLOAD_TEMP: `${API_BASE_URL}/api/v1/minio/upload/temp`,
  MINIO_DOWNLOAD: (bucket, filename) => `${API_BASE_URL}/api/v1/minio/download/${bucket}/${filename}`,
  MINIO_MOVE_TEMP_TO_STORAGE: (filename) => `${API_BASE_URL}/api/v1/minio/move/temp-to-storage/${filename}`,
  MINIO_LIST: (bucket) => `${API_BASE_URL}/api/v1/minio/list/${bucket}`,
  MINIO_DELETE: (bucket, filename) => `${API_BASE_URL}/api/v1/minio/delete/${bucket}/${filename}`,
};
