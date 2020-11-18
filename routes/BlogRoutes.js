const route = require("express").Router();
const path = require("path");
const {
  FetchBlogs,
  FetchBlogById,
  CreateBlog,
  UpdateBlog,
  LikeBlog,
  RemoveLikeBlog,
  DeleteBlog,
} = require("../controllers/BlogController");
const JwtAuth = require("../middleware/JwtAuth");

route.get("/", FetchBlogs);
route.get("/:blogId", FetchBlogById);
route.patch("/:blogId/update", JwtAuth, UpdateBlog);
route.post("/create/new", JwtAuth, CreateBlog);
route.get("/:blogId/like", JwtAuth, LikeBlog);
route.get("/:blogId/remove_like", JwtAuth, RemoveLikeBlog);
route.delete("/:blogId/delete", JwtAuth, DeleteBlog);

module.exports = route;
