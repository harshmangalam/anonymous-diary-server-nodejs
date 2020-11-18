const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const trendingPicSchema = new Schema(
  {
    title: String,
    image: String,
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrendingPic", trendingPicSchema);
