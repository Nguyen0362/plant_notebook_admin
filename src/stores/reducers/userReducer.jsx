const initState = {
  userData: {
    isloggedIn: false,
    token: 123
  }
}

const userReducer = (state = initState, action) => {
  switch (action.type) {

    default:
      return state;
  }
}

export default userReducer; 