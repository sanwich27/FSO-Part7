import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: null,
  reducers: {
    addNotification(state, action) {
      const { message, type } = action.payload
      return { message, type }
    },
    clearNotification() {
      return null
    }
  },
})

export const { addNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer

let timeOutID
export const setNotification = (message, period, type = 'info') => {
  return async dispatch  => {
    dispatch(addNotification({message, type}))
    if (typeof timeOutID === 'number') {
      clearTimeout(timeOutID)
    }
    timeOutID = setTimeout(() => { 
      dispatch(clearNotification()) 
      timeOutID = undefined
    }, period * 1000)
  }
}