const route = require("express").Router();
const path = require("path")
const {CreateQuote,FetchQuotes,FetchQuoteById,DeleteQuote,UpdateQuote,AddLike,RemoveLike} = require("../controllers/QuoteControllers");
const JwtAuth = require('../middleware/JwtAuth')


route.get("/",FetchQuotes)
route.get("/:quoteId",FetchQuoteById)
route.patch("/:quoteId/update",JwtAuth,UpdateQuote)
route.post("/create/new",JwtAuth,CreateQuote)
route.delete("/:quoteId/delete",JwtAuth,DeleteQuote)

route.get("/:quoteId/like",JwtAuth,AddLike)
route.get("/:quoteId/remove_like",JwtAuth,RemoveLike)

module.exports = route;
