import { createSlice } from "@reduxjs/toolkit";
import blogService from '../services/blogs'

const commentSlice = createSlice({
  name: 'comments',
  initialState: null,
  reducers: {
    setComments(state, action) {
      return action.payload
    },
    appendComment(state, action) {
      state.push(action.payload)
    }
  },
})

export const { setComments, appendComment } = commentSlice.actions
export default commentSlice.reducer

export const initializeComments = (id) => {
  return async dispatch  => {
    const response = await blogService.getComments(id);
    dispatch(setComments(response))
  }
}

export const addComment = (id, Obj) => {
  return async dispatch  => {
    const response = await blogService.addComment(id, Obj);
    dispatch(appendComment(response))
  }
}