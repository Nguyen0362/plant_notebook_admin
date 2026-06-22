import { apiLogin } from "../../services/auth"
import actionTypes from "./actionTypes"

export const login = (payload) => async (dispatch) => {
  try {
    const response = await apiLogin(payload)
    if (response?.data.err === 0) {
      const user = response.data.data?.user || response.data.user;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        data: response.data.data?.token || response.data.token
      })
    } else {
      dispatch({
        type: actionTypes.LOGIN_FAIL,
        data: response.data.msg
      })
    }
  } catch (error) {
    dispatch({
      type: actionTypes.LOGIN_FAIL,
      data: error.response?.data?.msg || error.message || "Lỗi kết nối server!"
    })
  }
}

export const logout = () => {
  localStorage.removeItem('user');
  return {
    type: actionTypes.LOGOUT
  }
}