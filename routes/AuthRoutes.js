const route = require("express").Router();
const { check, body } = require("express-validator"); 
const { Login, Signup, Logout } = require("../controllers/AuthControllers");
const User = require("../models/UserModels");
const JwtAuth = require("../middleware/JwtAuth");

const LoginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Email format is incorrect. Enter valid Email"),
  body("password").not().isEmpty().withMessage("Password must be Required"),
];
const SignupValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Email format is incorrect. Enter valid Email"),
  body("name").not().isEmpty().trim().withMessage("Name must  be Required"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Password must be Required")
    .isLength({ min: 6 })
    .withMessage("Password length should be greater than 6 characters"),

  check("email").custom((email) => {
    return User.findOne({ email }).then((user) => {
      if (user) {
        return Promise.reject("email already exists");
      }
    });
  }),
];

route.post("/login", LoginValidation, Login);
route.post("/signup", SignupValidation, Signup);
route.get("/logout", JwtAuth, Logout);

module.exports = route;
