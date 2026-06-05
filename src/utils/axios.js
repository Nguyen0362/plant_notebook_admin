import axios from 'axios';
import { message } from 'antd';

const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:5000',
});

// ===== Request Interceptor =====
// Tự động đính kèm Token vào header Authorization cho mọi request
instance.interceptors.request.use(
  (config) => {
    const persistAuth = localStorage.getItem('persist:auth');
    if (persistAuth) {
      try {
        const authData = JSON.parse(persistAuth);
        const token = authData.token ? JSON.parse(authData.token) : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Failed to parse persist:auth token", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===== Response Interceptor =====
// Xử lý response: nếu err !== 0 thì throw error, nếu 401 thì auto logout
instance.interceptors.response.use(
  (response) => {
    const data = response.data;

    // Nếu API trả về err !== 0 thì coi như lỗi
    if (data && data.err !== undefined && data.err !== 0) {
      const errorMessage = data.msg || 'Đã xảy ra lỗi từ server!';
      message.error(errorMessage);
      return Promise.reject(new Error(errorMessage));
    }

    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // Nếu mã 401 → Token hết hạn / không hợp lệ → Tự động logout
      if (status === 401) {
        message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
        // Xóa auth khỏi redux persist
        localStorage.removeItem('persist:auth');

        // Redirect về trang Login
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // Các lỗi HTTP khác
      const errorMessage =
        error.response.data?.msg || `Lỗi server (${status})`;
      message.error(errorMessage);
    } else if (error.request) {
      message.error('Không thể kết nối đến server. Vui lòng thử lại!');
    } else {
      message.error('Đã xảy ra lỗi không xác định!');
    }

    return Promise.reject(error);
  }
);

export default instance;
