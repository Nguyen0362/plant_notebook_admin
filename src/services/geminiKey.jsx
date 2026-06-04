import axiosConfig from "../axiosConfig"

export const apiGetGeminiKeys = async () => {
  try {
    const response = await axiosConfig({
      method: "get",
      url: "/admin/gemini-keys"
    })
    return response.data
  } catch (error) {
    console.error("apiGetGeminiKeys error:", error)
    throw error?.response?.data || error
  }
}

export const apiCreateGeminiKey = async (payload) => {
  try {
    const response = await axiosConfig({
      method: "post",
      url: "/admin/gemini-keys",
      data: payload
    })
    return response.data
  } catch (error) {
    console.error("apiCreateGeminiKey error:", error)
    throw error?.response?.data || error
  }
}

export const apiUpdateGeminiKey = async (id, payload) => {
  try {
    const response = await axiosConfig({
      method: "put",
      url: `/admin/gemini-keys/${id}`,
      data: payload
    })
    return response.data
  } catch (error) {
    console.error("apiUpdateGeminiKey error:", error)
    throw error?.response?.data || error
  }
}

export const apiDeleteGeminiKey = async (id) => {
  try {
    const response = await axiosConfig({
      method: "delete",
      url: `/admin/gemini-keys/${id}`
    })
    return response.data
  } catch (error) {
    console.error("apiDeleteGeminiKey error:", error)
    throw error?.response?.data || error
  }
}

export const apiPingGeminiKey = async (id) => {
  try {
    const response = await axiosConfig({
      method: "post",
      url: `/admin/gemini-keys/${id}/ping`
    })
    return response.data
  } catch (error) {
    console.error("apiPingGeminiKey error:", error)
    throw error?.response?.data || error
  }
}
