const express = require("express");
const app = express();
const cors = require("cors");

const mongoose = require("mongoose");

const path = require("path");
const AuthRoutes = require("./routes/AuthRoutes");
const UserRoutes = require("./routes/UserRoutes");
const ArticleRoutes = require("./routes/ArticleRoutes");
const QuoteRoutes = require("./routes/QuoteRoutes");
const BlogRoutes = require("./routes/BlogRoutes");
const TrendingPicRoutes = require("./routes/TrendingPicRoutes");

/// developmennt
// const morgan = require("morgan");
// require("dotenv").config();

const PORT = process.env.PORT || 8549;

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/webblog";

app.use(cors());
// development
// app.use(morgan("dev"));
//
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use("/api/auth", AuthRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/article", ArticleRoutes);
app.use("/api/quote", QuoteRoutes);
app.use("/api/blog", BlogRoutes);

app.use("/api/trending_pic", TrendingPicRoutes);

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("database connected");
      console.log(`server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
