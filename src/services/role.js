import axiosInstance from '../utils/axios';

// Lấy danh sách chức vụ
export const apiGetRoles = () => {
  return axiosInstance.get('/admin/roles');
};

// Tạo chức vụ mới
export const apiCreateRole = (data) => {
  return axiosInstance.post('/admin/roles', data);
};

// Cập nhật chức vụ
export const apiUpdateRole = (id, data) => {
  return axiosInstance.put(`/admin/roles/${id}`, data);
};

// Xóa chức vụ
export const apiDeleteRole = (id) => {
  return axiosInstance.delete(`/admin/roles/${id}`);
};
