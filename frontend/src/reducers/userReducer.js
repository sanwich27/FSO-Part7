import { createSlice } from "@reduxjs/toolkit";
import blogService from '../services/blogs'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: { 
    setUser(state, action) {
      return action.payload
    }
  },
});

export const { setUser } = userSlice.actions
export default userSlice.reducer

export const checkLoggedUser = () => {
  return async (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  };
};

export const login = (user) => {
  return async (dispatch) => {
    window.localStorage.setItem("loggedUser", JSON.stringify(user));
    blogService.setToken(user.token);
    dispatch(setUser(user));
  };
};

export const logout = () => {
  return async (dispatch) => {
    window.localStorage.removeItem("loggedUser");
    dispatch(setUser(null));
  };
};

