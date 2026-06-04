import axiosInstance from '../utils/axios';

export const apiLogin = async (payload) => {
  try {
    const response = await axiosInstance({
      method: 'post',
      url: '/admin/auth/login',
      data: payload,
    });
    return response;
  } catch (error) {
    throw error;
  }
};