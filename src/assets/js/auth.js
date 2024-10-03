import { Dropbox } from 'dropbox';

const APP_KEY = 'rq1ugo8ap9nctcv';

// 設置Dropbox登入後的重定向 URI，如果要修改，需要連同Dropbox的後台一起修改
const REDIRECT_URI = 'http://localhost:8080/handleToken/'; 

export const isDropboxAuth = () => {
    const localToken = localStorage.getItem('dropbox_access_token');
    return window.location.hash.includes('access_token') || 
      (localToken != null && localToken.trim() !== "");
  };
  
export const handleDropboxAuth = () => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get('access_token');
  
    if (accessToken) {
      // 保存 access token，用於後續 API 請求
      localStorage.setItem('dropbox_access_token', accessToken);
      window.location.hash = '';
    }
  };
  
  export const dropboxSignin = () => {
    var dbx = new Dropbox({ clientId: APP_KEY });
    dbx.auth.getAuthenticationUrl(REDIRECT_URI)
      .then((authUrl) => {
        // 讓使用者跳轉到 Dropbox 的登入頁面
        window.location.href = authUrl;
      })
      .catch((error) => {
        console.error('Error getting authentication URL:', error);
      });
  };
  
  export const dropboxSignout = () => {
    localStorage.removeItem('dropbox_access_token');
    window.location.href = "/";
  }