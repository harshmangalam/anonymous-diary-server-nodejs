const Blog = require("../models/BlogModels");
const User = require("../models/UserModels");
const TransformBlog = require("../utils/TransformBlog");

function checkAlreadyLike(blog, user_id) {
  let index = blog.likes.indexOf(user_id);
  return index === -1 ? { data: false, index } : { data: true, index };
}

exports.FetchBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate("creator").populate("likes");
    const transformBlog = blogs.map((blog) => TransformBlog(blog));
    res.status(200).json({ data: transformBlog });
  } catch (err) {
    console.log(err);
  }
};

exports.FetchBlogById = async (req, res) => {
  try {
    const blogs = await Blog.findById(req.params.blogId)
      .populate("creator")
      .populate("likes");
    const transformBlog = TransformBlog(blog);
    res.status(200).json({ data: transformBlog });
  } catch (err) {
    console.log(err);
  }
};

exports.CreateBlog = async (req, res) => {
  let { title, text, tags, image } = req.body;
  try {
    const blog = new Blog({
      title,
      body: {
        text,
        image,
      },
      creator: req.user.id,
    });
    if (tags.length) {
      tags.map((t) => blog.tags.push(t));
    }
    const saveBlog = await blog.save();
    const getBlog = await Blog.findById(saveBlog.id)
      .populate("creator")
      .populate("likes");
    const transformBlog = TransformBlog(getBlog);
    res.status(201).json({
      data: transformBlog,
      message: `New Blogs Created "${saveBlog.title}"`,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.UpdateBlog = async (req, res) => {
  let { title, image, text, tags } = req.body;

  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ error: "blog not found" });
    if (blog.creator != req.user.id)
      return res.status(400).json({ error: "you cannot update someone blog" });

    const body = {};
    body.image = image;
    body.text = text;

    const blogData = {};
    blogData.body = body;
    blogData.title = title;
    blogData.tags = [];
    if (tags.length) {
      tags.map((t) => blogData.tags.push(t));
    }
    await Blog.updateOne({ _id: req.params.blogId }, blogData);
    const getBlog = await Blog.findById(blog.id).populate("creator");
    const transformBlog = TransformBlog(getBlog);
    res.status(200).json({
      data: transformBlog,
      message: `you have updated ${getBlog.title} `,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.LikeBlog = async (req, res) => {
  const currentUser_id = req.user.id;
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ error: "blog not found" });

    let isLike = checkAlreadyLike(blog, currentUser_id);
    if (isLike.data)
      return res.status(400).json({ error: "you already like this blog" });

    blog.likes.push(currentUser_id);
    await blog.save();

    const getBlog = await Blog.findById(req.params.blogId)
      .populate("creator")
      .populate("likes");
    const transformBlog = TransformBlog(getBlog);
    res.status(200).json({
      data: transformBlog,
      message: "like",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.RemoveLikeBlog = async (req, res) => {
  const currentUser_id = req.user.id;
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ error: "blog not found" });

    let isLike = checkAlreadyLike(blog, currentUser_id);
    if (!isLike.data)
      return res.status(400).json({ error: "you still not like this blog" });

    blog.likes.splice(isLike.index, 1);
    await blog.save();
    const getBlog = await Blog.findById(req.params.blogId)
      .populate("creator")
      .populate("likes");
    const transformBlog = TransformBlog(getBlog);
    res.status(200).json({
      data: transformBlog,
      message: "remove like",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.DeleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ error: "blog not found" });
    if (blog.creator != req.user.id)
      return res.status(400).json({
        success: false,
        error: "you cannot delete other user blog",
      });

    await Blog.deleteOne({ _id: blog.id });

    res.status(200).json({ message: `Blog Deleted ` });
  } catch (err) {
    console.log(err);
  }
};
