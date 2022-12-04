import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleCreation = (event) => {
    event.preventDefault();
    createBlog({ title, author, url });

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div>
      <form onSubmit={handleCreation}>
        <div>
          title{" "}
          <input
            id="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder="enter the title"
          />
        </div>
        <div>
          author{" "}
          <input
            id="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="enter the author"
          />
        </div>
        <div>
          url{" "}
          <input
            id="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            placeholder="enter the url"
          />
        </div>
        <button id="create-button" type="submit">
          create
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
