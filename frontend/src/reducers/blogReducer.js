import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import { setNotification } from "./notificationReducer";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload;
      return state.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog: blog 
      );
    },
    removeBlog(state, action) {
      const deletedID = action.payload;
      return state.filter((blog) => blog.id !== deletedID);
    }
  },
});

export const { setBlogs, appendBlog, updateBlog, removeBlog } = blogSlice.actions;
export default blogSlice.reducer;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const newBlog = (blogObj) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(blogObj);
      dispatch(appendBlog(newBlog));
      dispatch(
        setNotification(
          `"${blogObj.title}" by ${blogObj.author} is added to blog list`,
          5
        )
      );
    } 
    catch (exception) {
      dispatch(setNotification("Failed to add a new blog!", 5, "alert"));
    }
  };
};

export const likeBlog = (id, blogObj) => {
  return async (dispatch) => {
    try {
      const response = await blogService.update(id, blogObj); //likes increased in ../components/Blog.js
      dispatch(updateBlog(response));
      dispatch(
        setNotification(`"${blogObj.title}" by ${blogObj.author} is liked!`, 5)
      );
    } catch (exception) {
      dispatch(setNotification("Failed to increase likes!", 5, "alert"));
    }
  };
};

export const deleteABlog = (blogObj) => {
  return async (dispatch) => {
    try {
      const approval = window.confirm(
        `Delete ${blogObj.title} by ${blogObj.author}?`
      );
      if (approval) {
        await blogService.remove(blogObj.id);
        dispatch(removeBlog(blogObj.id));
        dispatch(
          setNotification(
            `"${blogObj.title}" by ${blogObj.author} is deleted successfully!`,
            5
          )
        );
      }
    } catch (exception) {
      dispatch(setNotification("Failed to delete this blog!", 5, "alert"));
    }
  };
};
