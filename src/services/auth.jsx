import axiosConfig from "../axiosConfig"

export const apiLogin = async (payload) => {
  try {
    const response = await axiosConfig({
      method: "post",
      url: "/admin/auth/login",
      data: payload
    })

    return response
  } catch (error) {
    console.log(error.response.data)
  }
}