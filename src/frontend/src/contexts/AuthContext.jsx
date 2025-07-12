import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('access_token'));

  // ログアウト関数
  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    setToken(null);
    setUser(null);
  }, []);

  // ユーザー情報を取得する関数
  const fetchUserInfo = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // トークンが無効な場合はクリア
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  // ログイン関数（トークンのセット）
  const login = useCallback((accessToken, tokenType = 'bearer') => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('token_type', tokenType);
    setToken(accessToken);
  }, []);

  // ユーザー登録関数
  const register = useCallback(async (userData) => {
    const response = await fetch('http://localhost:8000/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '登録に失敗しました');
    }

    const data = await response.json();
    
    // 登録後自動的にログイン
    login(data.access_token, data.token_type);
    
    return data;
  }, [login]);

  // 企業ユーザー登録関数
  const registerEnterprise = useCallback(async (userData) => {
    const response = await fetch('http://localhost:8000/api/v1/auth/register/enterprise', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '企業ユーザー登録に失敗しました');
    }

    const data = await response.json();
    
    // 登録後自動的にログイン
    login(data.access_token, data.token_type);
    
    return data;
  }, [login]);

  // ログイン関数
  const signIn = useCallback(async (email, password) => {
    const response = await fetch('http://localhost:8000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'ログインに失敗しました');
    }

    const data = await response.json();
    login(data.access_token, data.token_type);
    
    return data;
  }, [login]);

  // トークンが変更されたときにユーザー情報を取得
  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    signIn,
    registerEnterprise,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
