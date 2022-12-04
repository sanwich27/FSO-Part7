import { configureStore } from "@reduxjs/toolkit";

import blogReducer from "./reducers/blogReducer";
import commentReducer from "./reducers/commentReducer";
import notificationReducer from "./reducers/notificationReducer";
import userReducer from "./reducers/userReducer";

const store = configureStore({
  reducer: {
    notifications: notificationReducer,
    blogs: blogReducer,
    user: userReducer,
    comments: commentReducer
  },
});

export default store;
