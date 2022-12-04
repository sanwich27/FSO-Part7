import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Link, useMatch, useNavigate } from "react-router-dom";
import { Button, Page, Navigation, Footer, StyledLink, BlogList } from "./style";

import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import Notification from "./components/Notification";

import { setNotification } from "./reducers/notificationReducer";
import {
  initializeBlogs,
  newBlog,
  likeBlog,
  deleteABlog,
} from "./reducers/blogReducer";
import { checkLoggedUser, login, logout } from "./reducers/userReducer";

import loginService from "./services/login";
import userService from "./services/users";

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  const [users, setUsers] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    dispatch(initializeBlogs());
  }, []);

  useEffect(() => {
    dispatch(checkLoggedUser());
  }, []);

  useEffect(() => {
    const getAllUsers = async () => {
      const response = await userService.getAll();
      setUsers(response);
    };
    getAllUsers();
  }, []);

  const match = useMatch("/users/:id");
  const userDetail =
    match && users ? users.find((u) => u.id === match.params.id) : null;

  const matchBlog = useMatch("/blogs/:id");
  const blogDetail = matchBlog
    ? blogs.find((b) => b.id === matchBlog.params.id)
    : null;

  const addBlog = async (blogObj) => {
    blogFormRef.current.toggleVisibility();
    dispatch(newBlog(blogObj));
  };

  const blogFormRef = useRef();
  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  );

  const handleLogout = async () => {
    dispatch(logout());
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      dispatch(login(user));
      dispatch(setNotification("Login successfully", 5));
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(setNotification("Wrong username or password!", 5, "alert"));
    }
  };

  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleSubmit={handleLogin}
    />
  );
  const increaseLikes = async (blogObj) => {
    dispatch(likeBlog(blogObj.id, blogObj));
  };
  const deleteBlog = async (blogObj) => {
    dispatch(deleteABlog(blogObj));
    navigate('/');
  };
  const allBlogs = () => (
    <div>
      <h2>blogs</h2>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <BlogList key={blog.id}>
            <StyledLink to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </StyledLink>
          </BlogList>
        ))}
    </div>
  );
  return (
    <div>
      <Notification />
      {user === null ? (
        loginForm()
      ) : (
          <Page>
            <Navigation>
              <Nav />
              {user.name} logged-in <Button id="logout-button" onClick={handleLogout}>
                logout
              </Button>
            </Navigation>
            <Routes>
              <Route
                path="/users/:id"
                element={<User userDetail={userDetail} />}
              />
              <Route path="/users" element={<Users users={users} />} />
              <Route
                path="/blogs/:id"
                element={
                  blogDetail
                  ? <Blog
                    key={blogDetail.id}
                    blog={blogDetail}
                    increaseLikes={increaseLikes}
                    deletePermission={user.username === blogDetail.user.username}
                    deleteBlog={deleteBlog}
                  />
                  : null
                }
              />
              <Route
                path="/blogs"
                element={<BlogsView blogForm={blogForm} allBlogs={allBlogs} />}
              />
              <Route
                path="/"
                element={<BlogsView blogForm={blogForm} allBlogs={allBlogs} />}
              />
            </Routes>
            <Footer>
              <footer>
                <em>styled components revised from Full stack open by xyl, 2022</em>
              </footer>
            </Footer>
          </Page>
      )}
    </div>
  );
};

const BlogsView = ({ blogForm, allBlogs }) => {
  return (
    <div>
      <h2>create a new blog</h2>
      {blogForm()}
      {allBlogs()}
    </div>
  );
};

const User = ({ userDetail }) => {
  if (!userDetail) return <div>not loaded yet...</div>;
  else
    return (
      <div>
        <h2>{userDetail.name}</h2>
        <ul>
          {userDetail.blogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      </div>
    );
};

const Users = ({ users }) => {
  const padding = {
    padding: 5,
  };

  if (!users) return <div>not loaded yet...</div>;
  else
    return (
      <div>
        <h2>Users</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>
                <strong>blogs created</strong>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.name}>
                <td>
                  <Link style={padding} to={`/users/${user.id}`}>
                    {user.name}
                  </Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
};

const Nav = () => {
  const padding = {
    padding: 5,
  };
  return (
    <div>
      <Link style={padding} to="/blogs">
        blogs
      </Link>
      <Link style={padding} to="/users">
        users
      </Link>
    </div>
  );
};

export default App;
