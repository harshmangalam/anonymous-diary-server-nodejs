const User = require("../models/UserModels");
const TransformUser = require("../utils/TransformUser");

const bcrypt = require("bcrypt");

exports.FetchUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user)
      return res.status(404).json({ success: false, error: "user not found" });

    const transformUser = TransformUser(user);
    res.status(200).json({ success: true, data: transformUser });
  } catch (err) {
    console.log(err);
  }
};

exports.FetchUsers = async (req, res) => {
  try {
    const users = await User.find({});
    const transformUser = users.map((user) => TransformUser(user));
    res.status(200).json({ success: true, data: transformUser });
  } catch (err) {
    console.log(err);
  }
};

exports.DeleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user)
      return res.status(404).json({ success: false, error: "user not found" });

    const isCurrentUser =
      req.user.id === user.id ? true : req.user.admin ? true : false;
    if (!isCurrentUser)
      return res.status(403).json({
        success: false,
        error: `${req.user.name} You have not permitted to delete ${user.name} Account`,
      });

    await User.deleteOne({ _id: user.id });
    res.status(200).json({
      success: true,
      message: ` Account deleted successfully`,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.UpdateAccount = async (req, res) => {
  let {
    name,
    email,
    bio,
    image,
    facebook,
    instagram,
    phone,
    address,
    password,
  } = req.body;
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "user not found" });
    if (user.id !== req.user.id)
      return res
        .status(400)
        .json({ error: "you cannot update another user account" });

    const userData = { name, email, bio, profile_pic:image };

    const social = {
      facebook,
      instagram,
      phone,
      address,
    };
    userData.social = social;
    if (password) {
      const hashPassword = await bcrypt.hash(password, 12);
      userData.password = hashPassword;
    }
    await User.updateOne({ _id: req.params.userId }, userData);
    const getUser = await User.findById(user.id);
    const transformUser = TransformUser(getUser);
    res.status(200).json({
      success: true,
      data: transformUser,
      message: `${getUser.name} you have updated your account`,
    });
  } catch (err) {
    console.log(err);
  }
};
