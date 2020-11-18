const Article = require("../models/ArticleModels");
const User = require("../models/UserModels");

const { validationResult } = require("express-validator");
const TransformArticle = require("../utils/TransformArticle");

function checkAlreadyLike(article, user_id) {
  let index = article.likes.indexOf(user_id);
  return index === -1 ? { data: false, index } : { data: true, index };
}

exports.CreateNewArticle = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = {};
    errors.errors.map((err) => {
      error[err.param] = err.msg;
    });
    return res.status(422).json({ error });
  }

  try {
    let { title, text, image, tags } = req.body;
    const article = new Article({
      title,
      body: {
        image,
        text,
      },
      creator: req.user.id,
    });

    if (tags.length) {
      tags.map((t) => article.tags.push(t));
    }
    const saveArticle = await article.save();
    const getArticle = await Article.findById(saveArticle.id)
      .populate("creator")
      .populate("likes");
    const transformArticle = TransformArticle(getArticle);
    res.status(201).json({
      data: transformArticle,
      message: `New Articles Created "${saveArticle.title}"`,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.FetchArticles = async (req, res) => {
  try {
    const articles = await Article.find({})
      .populate("creator")
      .populate("likes");
    const transformArticles = articles.map((article) =>
      TransformArticle(article)
    );
    res.status(200).json({ data: transformArticles });
  } catch (err) {
    console.log(err);
  }
};
exports.FetchArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.articleId)
      .populate("creator")
      .populate("likes");
    const transformArticle = TransformArticle(article);
    res.status(200).json({ data: transformArticle });
  } catch (err) {
    console.log(err);
  }
};

exports.DeleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.articleId);
    if (!article) return res.status(404).json({ error: "article not found" });
    if (article.creator != req.user.id)
      return res.status(400).json({
        success: false,
        error: "you cannot delete other user article",
      });

    await Article.deleteOne({ _id: article.id });
    res.status(200).json({ message: `Article Deleted ` });
  } catch (err) {
    console.log(err);
  }
};

exports.UpdateArticle = async (req, res) => {
  
  let { title, image, text, tags } = req.body;
  try {
    const article = await Article.findById(req.params.articleId);
    if (!article) return res.status(404).json({ error: "article not found" });
    if (article.creator != req.user.id)
      return res
        .status(400)
        .json({ error: "you cannot update someone article" });

    const body = {};
    body.text = text;
    body.image = image;
    const articleData = {};
    articleData.body = body;
    articleData.title = title;
    articleData.tags = [];
    if (tags.length) {
      tags.map((t) => articleData.tags.push(t));
    }

    await Article.updateOne({ _id: req.params.articleId }, articleData);
    const getArticle = await Article.findById(article.id)
      .populate("creator")
      .populate("likes");
    const transformArticle = TransformArticle(getArticle);
    res.status(200).json({
      success: true,
      data: transformArticle,
      message: `you have updated article `,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.AddLike = async (req, res) => {
  const currentUser_id = req.user.id;
  try {
    const article = await Article.findById(req.params.articleId);
    if (!article) return res.status(404).json({ error: "article not found" });

    let isLike = checkAlreadyLike(article, currentUser_id);
    if (isLike.data)
      return res.status(400).json({ error: "you already like this article" });

    article.likes.push(currentUser_id);
    await article.save();

    const getArticle = await Article.findById(req.params.articleId)
      .populate("creator")
      .populate("likes");
    const transformArticle = TransformArticle(getArticle);
    res.status(200).json({
      data: transformArticle,
      message: "like",
    });
  } catch (err) {
    console.log(err);
  }
};

// remove likes from post
exports.RemoveLike = async (req, res) => {
  const currentUser_id = req.user.id;
  try {
    const article = await Article.findById(req.params.articleId);
    if (!article) return res.status(404).json({ error: "article not found" });

    let isLike = checkAlreadyLike(article, currentUser_id);
    if (!isLike.data)
      return res.status(400).json({ error: "you still not like this article" });

    article.likes.splice(isLike.index, 1);
    await article.save();
    const getArticle = await Article.findById(req.params.articleId)
      .populate("creator")
      .populate("likes");
    const transformArticle = TransformArticle(getArticle);
    res.status(200).json({
      data: transformArticle,
      message: "remove like",
    });
  } catch (err) {
    console.log(err);
  }
};
