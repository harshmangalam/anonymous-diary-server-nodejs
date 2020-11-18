const route = require("express").Router();
const path = require("path");
const {
  CreateNewPic,
  FetchTrendingPic,
  DeletePic,
  AddLike,
  RemoveLike,
} = require("../controllers/TrendingPicControllers");
const JwtAuth = require("../middleware/JwtAuth");
const multer = require("multer");

route.get("/", FetchTrendingPic);

route.post("/create/new", JwtAuth, CreateNewPic);
route.delete("/:picId/delete", JwtAuth, DeletePic);

route.get("/:picId/like", JwtAuth, AddLike);
route.get("/:picId/remove_like", JwtAuth, RemoveLike);

module.exports = route;
