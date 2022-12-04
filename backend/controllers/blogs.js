const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const Comment = require('../models/comment');

blogsRouter.get('/:id/comments', async (request, response) => {
  const comments = await Comment.find({ blog: request.params.id });
  response.json(comments);
});

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { blogs: 0 });
  response.json(blogs);
});

blogsRouter.post('/:id/comments', async (request, response) => {
  const { content } = request.body;
  const comment = new Comment({
    content,
    blog: request.params.id,
  });
  const savedComment = await comment.save();
  response.status(201).json(savedComment);
});

blogsRouter.post('/', async (request, response) => {
  const { body, user } = request;

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  const returnedBlog = await savedBlog.populate('user', { blogs: 0 });
  response.status(201).json(returnedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  const blogToDelete = await Blog.findById(request.params.id);
  const { user } = request;

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  if (blogToDelete.user._id.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'only the creator of the blog is authorized' });
  }

  await Blog.findByIdAndRemove(blogToDelete._id);
  user.blogs = user.blogs
    .filter((blog) => blog._id.toString() !== blogToDelete._id.toString());
  await user.save();
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  // const { user } = request;
  // if (!user) {
  //   return response.status(401).json({ error: 'token missing or invalid' });
  // }
  // const blogToUpdate = await Blog.findById(request.params.id);
  // if (blogToUpdate.user._id.toString() !== user._id.toString()) {
  //   return response.status(401).json({ error: 'only the creator of the blog is authorized' });
  // }

  // const {
  //   title, url, author, likes,
  // } = request.body;

  // const updatedBlog = await Blog.findByIdAndUpdate(
  //   request.params.id,
  //   {
  //     title, author, url, likes,
  //   },
  //   { new: true, runValidators: true, context: 'query' },
  // );

  const newObj = request.body;

  const updatedBlog = await Blog
    .findByIdAndUpdate(
      request.params.id,
      {
        ...newObj,
      },
      { new: true, runValidators: true, context: 'query' },
    )
    .populate('user', { blogs: 0 });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
