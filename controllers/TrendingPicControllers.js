const TrendingPic = require("../models/TrendingPicModels");
const TransformImage = require("../utils/TransformTrendingPic");

function checkAlreadyLike(image, user_id) {
  let index = image.likes.indexOf(user_id);
  return index === -1 ? { data: false, index } : { data: true, index };
}

exports.FetchTrendingPic = async (req, res) => {
  try {
    const pics = await TrendingPic.find({})
      .populate("creator")
      .populate("likes");
    const transformPic = pics.map((pic) => TransformImage(pic));
    res.status(200).json({ data: transformPic });
  } catch (err) {
    console.log(err);
  }
};

exports.CreateNewPic = async (req, res) => {
  const { title, image } = req.body;
  try {
    const trending = new TrendingPic({
      title,
      image,
      creator: req.user.id,
    });
    const savePic = await trending.save();
    const pic = await TrendingPic.findById(savePic.id)
      .populate("creator")
      .populate("likes");
    const transformPic = TransformImage(pic);
    res
      .status(201)
      .json({ data: transformPic, message: "trending pic created" });
  } catch (err) {
    console.log(err);
  }
};
exports.DeletePic = async (req, res) => {
  try {
    const image = await TrendingPic.findById(req.params.picId);
    if (!image)
      return res.status(404).json({ success: false, error: "image not found" });
    if (image.creator != req.user.id)
      return res.status(400).json({
        success: false,
        error: "you cannot delete admin image",
      });

    await TrendingPic.deleteOne({ _id: image.id });

    res.status(200).json({ success: true, message: "image deleted" });
  } catch (err) {
    console.log(err);
  }
};

exports.AddLike = async (req, res) => {
  const currentUser_id = req.user.id;
  try {
    const trending_pic = await TrendingPic.findById(req.params.picId);
    if (!trending_pic) return res.status(404).json({ error: "pic not found" });

    let isLike = checkAlreadyLike(trending_pic, currentUser_id);
    if (isLike.data)
      return res.status(400).json({ error: "you already like this pic" });

    trending_pic.likes.push(currentUser_id);
    await trending_pic.save();

    const getTrendingPic = await TrendingPic.findById(req.params.picId)
      .populate("creator")
      .populate("likes");
    const transformImage = TransformImage(getTrendingPic);
    res.status(200).json({
      data: transformImage,
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
    const trending_pic = await TrendingPic.findById(req.params.picId);
    if (!trending_pic) return res.status(404).json({ error: "pic not found" });

    let isLike = checkAlreadyLike(trending_pic, currentUser_id);
    if (!isLike.data)
      return res.status(400).json({ error: "you still not like this pic" });

    trending_pic.likes.splice(isLike.index, 1);
    await trending_pic.save();
    const getPic = await TrendingPic.findById(req.params.picId)
      .populate("creator")
      .populate("likes");
    const transformImage = TransformImage(getPic);
    res.status(200).json({
      data: transformImage,
      message: "remove like",
    });
  } catch (err) {
    console.log(err);
  }
};
