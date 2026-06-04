import axiosInstance from '../utils/axios';

// Lấy danh sách nhật ký hệ thống (có phân trang)
export const apiGetLogs = (params = {}) => {
  return axiosInstance.get('/admin/logs', { params });
};
