import axiosInstance from '../utils/axios';

// Lấy danh sách tất cả các quyền
export const apiGetPermissions = () => {
  return axiosInstance.get('/admin/permissions');
};
