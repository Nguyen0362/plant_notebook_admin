import axiosConfig from '../axiosConfig'

export const apiGetPlants = (params) => new Promise(async (resolve, reject) => {
  try {
    const response = await axiosConfig({
      method: 'get',
      url: '/admin/library-plants',
      params
    })
    resolve(response)
  } catch (error) {
    reject(error)
  }
})

export const apiGetPlantById = (id) => new Promise(async (resolve, reject) => {
  try {
    const response = await axiosConfig({
      method: 'get',
      url: `/admin/library-plants/${id}`
    })
    resolve(response)
  } catch (error) {
    reject(error)
  }
})

export const apiCreatePlant = (formData) => new Promise(async (resolve, reject) => {
  try {
    const response = await axiosConfig({
      method: 'post',
      url: '/admin/library-plants',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    resolve(response)
  } catch (error) {
    reject(error)
  }
})

export const apiUpdatePlant = (id, formData) => new Promise(async (resolve, reject) => {
  try {
    const response = await axiosConfig({
      method: 'put',
      url: `/admin/library-plants/${id}`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    resolve(response)
  } catch (error) {
    reject(error)
  }
})

export const apiDeletePlant = (id) => new Promise(async (resolve, reject) => {
  try {
    const response = await axiosConfig({
      method: 'delete',
      url: `/admin/library-plants/${id}`
    })
    resolve(response)
  } catch (error) {
    reject(error)
  }
})

export const apiApprovePlant = (id) => new Promise(async (resolve, reject) => {
  try {
    const response = await axiosConfig({
      method: 'put',
      url: `/admin/library-plants/${id}/approve`
    })
    resolve(response)
  } catch (error) {
    reject(error)
  }
})

export const apiRejectPlant = (id) => new Promise(async (resolve, reject) => {
  try {
    const response = await axiosConfig({
      method: 'put',
      url: `/admin/library-plants/${id}/reject`
    })
    resolve(response)
  } catch (error) {
    reject(error)
  }
})
