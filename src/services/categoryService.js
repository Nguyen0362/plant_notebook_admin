import axiosConfig from '../axiosConfig';

export const apiGetCategories = () => new Promise(async (resolve, reject) => {
  try {
    const response = await axiosConfig({
      method: 'get',
      url: '/admin/categories'
    });
    resolve(response);
  } catch (error) {
    reject(error);
  }
});

export const apiCreateCategory = (name) => new Promise(async (resolve, reject) => {
  try {
    const response = await axiosConfig({
      method: 'post',
      url: '/admin/categories',
      data: { name }
    });
    resolve(response);
  } catch (error) {
    reject(error);
  }
});

export const apiUpdateCategory = (id, name) => new Promise(async (resolve, reject) => {
  try {
    const response = await axiosConfig({
      method: 'put',
      url: `/admin/categories/${id}`,
      data: { name }
    });
    resolve(response);
  } catch (error) {
    reject(error);
  }
});

export const apiDeleteCategory = (id) => new Promise(async (resolve, reject) => {
  try {
    const response = await axiosConfig({
      method: 'delete',
      url: `/admin/categories/${id}`
    });
    resolve(response);
  } catch (error) {
    reject(error);
  }
});
