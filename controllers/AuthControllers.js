const User = require("../models/UserModels");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const TransformUser = require("../utils/TransformUser")

const JWT_SECRET = process.env.JWT_SECRET || "itsssecret";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "10h";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin12345";



exports.Login = async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = {};
    errors.errors.map((err) => {
      error[err.param] = err.msg;
    });
    return res.status(422).json({ error });
  }
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        success: false,
        error: "email or password combination are incorrect",
      });
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword)
      return res.status(400).json({
        success: false,
        error: "email or password combination are incorrect",
      });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRE,
    });
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      user.admin = true;
    }
    user.online = true;
    await user.save();
    const transformUser = TransformUser(user);
    return res.status(201).json({
      message: user.admin
        ? `Admin login as ${user.name}`
        : `Account login as ${user.name}`,
      data: transformUser,
      admin: user.admin,
      token,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.Signup = async (req, res) => {
  const { email, password, name } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = {};
    errors.errors.map((err) => {
      error[err.param] = err.msg;
    });
    return res.status(422).json({ error });
  }
  try {
    const hashPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashPassword,
    });
    user.lastLogin = new Date().toISOString();
    const saveUser = await user.save();
    const userData = await User.findById(saveUser.id);
    const transformUser = TransformUser(userData);
    return res.status(201).json({
      message: `Account created for ${userData.name}`,
      data: transformUser,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.Logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.online = false;
    user.lastLogin = new Date().toISOString();
    req.user = null;

    await user.save();
    res.status(200).json({ message: "logout successfully" });
  } catch (err) {
    console.log(err);
  }
};
