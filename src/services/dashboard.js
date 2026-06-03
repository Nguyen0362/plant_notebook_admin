import axiosInstance from '../utils/axios';

export const apiGetDashboard = async () => {
  try {
    const response = await axiosInstance({
      method: 'get',
      url: '/admin/dashboard',
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
