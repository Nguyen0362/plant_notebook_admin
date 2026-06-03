import axiosInstance from '../utils/axios';

// Lấy danh sách chức vụ
export const apiGetRoles = () => {
  return axiosInstance.get('/admin/roles');
};
