const route = require("express").Router();
const path = require("path")
const { check, body } = require("express-validator");
const {CreateNewArticle,FetchArticles,FetchArticleById,DeleteArticle,UpdateArticle,AddLike,RemoveLike} = require("../controllers/ArticleControllers");
const JwtAuth = require('../middleware/JwtAuth')


route.get("/",FetchArticles)
route.get("/:articleId",FetchArticleById)
route.get("/:articleId/like",JwtAuth,AddLike)
route.get("/:articleId/remove_like",JwtAuth,RemoveLike)
route.patch("/:articleId/update",JwtAuth,UpdateArticle)
route.post("/create/new",JwtAuth,CreateNewArticle)
route.delete("/:articleId/delete",JwtAuth,DeleteArticle)

module.exports = route;
