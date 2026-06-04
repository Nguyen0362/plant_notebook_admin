import axiosInstance from '../utils/axios';

// Lấy danh sách users
export const apiGetUsers = () => {
  return axiosInstance.get('/admin/users');
};

// Thêm mới user
export const apiCreateUser = (data) => {
  return axiosInstance.post('/admin/users', data);
};

// Cập nhật user
export const apiUpdateUser = (id, data) => {
  return axiosInstance.put(`/admin/users/${id}`, data);
};

// Xóa user
export const apiDeleteUser = (id) => {
  return axiosInstance.delete(`/admin/users/${id}`);
};
