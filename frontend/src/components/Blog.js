import { useSelector, useDispatch } from "react-redux";
import { initializeComments, addComment} from "../reducers/commentReducer";
import { useEffect } from "react";

const Blog = ({ blog, increaseLikes, deletePermission, deleteBlog }) => {
  const comments = useSelector(state => state.comments)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeComments(blog.id))
  }, [])

  const deleteButtonStyle = { display: deletePermission ? "" : "none" };

  const addLikes = async (blogObj) => {
    const newObj = {
      ...blogObj,
      user: blogObj.user.id,
      likes: blogObj.likes + 1,
    };
    await increaseLikes(newObj);
  };

  const handleSubmit = (event) => {
    event.preventDefault()
    const content = event.target.comment.value
    event.target.comment.value = ''
    dispatch(addComment(blog.id, {content}))
  }


  return (
    <div>
      <h2>{blog.title}</h2>
      <br />
      {blog.url} <br />
      likes {blog.likes}{" "}
      <button id="like-button" onClick={() => addLikes(blog)}>
        like
      </button>{" "}
      <br />
      added by {blog.author} <br />
      <button
        id="delete-button"
        style={deleteButtonStyle}
        onClick={() => deleteBlog(blog)}
      >
        delete
      </button>
      <h3>comments</h3>
      <form onSubmit={handleSubmit}>
        <input 
          name='comment'
        />
        <button type='submit'>add comment</button>
      </form>
      <ul>
        { comments
          ? comments.map(comment => 
          <li key={comment.id}>{comment.content}</li> )
          : <li>not loaded yet...</li>
        }
      </ul>
    </div>
  );
};

export default Blog;
