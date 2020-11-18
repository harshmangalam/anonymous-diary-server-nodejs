const route = require("express").Router();
const {FetchUsers,FetchUserById, DeleteAccount,UpdateAccount} = require("../controllers/UserControllers");
const JwtAuth = require('../middleware/JwtAuth')
const path = require("path")
const multer = require("multer")



route.get("/",FetchUsers)
route.get("/:userId",FetchUserById)

route.delete("/:userId/delete", JwtAuth, DeleteAccount);
route.patch("/:userId/update", JwtAuth,UpdateAccount);

module.exports = route;
