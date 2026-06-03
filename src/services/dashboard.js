import axiosInstance from '../utils/axios';

// Lấy tổng quan dashboard (summary counts)
export const apiGetDashboard = async () => {
  const response = await axiosInstance.get('/admin/dashboard');
  return response.data;
};

// Lấy dữ liệu time-series (users + garden plants theo ngày)
export const apiGetTimeseries = async (days = 30) => {
  const response = await axiosInstance.get('/admin/dashboard/timeseries', {
    params: { days }
  });
  return response.data;
};

// Lấy dữ liệu analytics (phân loại, trạng thái, loại cửa hàng, chăm sóc, user mới nhất)
export const apiGetAnalytics = async () => {
  const response = await axiosInstance.get('/admin/dashboard/analytics');
  return response.data;
};
