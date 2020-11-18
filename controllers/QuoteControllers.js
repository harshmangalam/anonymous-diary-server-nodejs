const Quote = require("../models/QuoteModels");
const User = require("../models/UserModels");
const TransformQuote = require("../utils/TransformQuote");

function checkAlreadyLike(quote, user_id) {
  let index = quote.likes.indexOf(user_id);
  return index === -1 ? { data: false, index } : { data: true, index };
}

exports.FetchQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find({}).populate("creator").populate("likes");
    const transformQuote = quotes.map((quote) => TransformQuote(quote));
    res.status(200).json({ data: transformQuote });
  } catch (err) {
    console.log(err);
  }
};
exports.FetchQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.quoteId)
      .populate("creator")
      .populate("likes");
    const transformQuote = TransformQuote(quote);

    res.status(200).json({ data: transformQuote });
  } catch (err) {
    console.log(err);
  }
};

exports.CreateQuote = async (req, res) => {
  let { title, text, tags, image } = req.body;
  try {
    const quote = new Quote({
      title,
      body: {
        text,
        image,
      },
      creator: req.user.id,
    });
    if (tags.length) {
      tags.map((t) => quote.tags.push(t));
    }
    const saveQuote = await quote.save();
    const getQuote = await Quote.findById(saveQuote.id)
      .populate("creator")
      .populate("likes");
    const transformQuote = TransformQuote(getQuote);
    res.status(201).json({
      data: transformQuote,
      message: "quote created",
    });
  } catch (err) {
    console.log(err);
  }
};
exports.DeleteQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.quoteId);
    if (!quote)
      return res.status(404).json({ success: false, error: "quote not found" });
    if (quote.creator != req.user.id)
      return res.status(400).json({
        success: false,
        error: "you cannot delete other user quote",
      });

    await Quote.deleteOne({ _id: quote.id });

    res.status(200).json({ success: true, message: "quote deleted" });
  } catch (err) {
    console.log(err);
  }
};

exports.UpdateQuote = async (req, res) => {
  let { title, image, text, tags } = req.body;
  
  try {
    const quote = await Quote.findById(req.params.quoteId);
    if (!quote) return res.status(404).json({ error: "quote not found" });
    if (quote.creator != req.user.id)
      return res.status(400).json({ error: "you cannot update someone quote" });

    const body = {};
    body.image = image;
    body.text = text;

    const quoteData = {};
    quoteData.body = body;
    quoteData.title = title;
    quoteData.tags = [];
    if (tags.length) {
      tags.map((t) => quoteData.tags.push(t));
    }
    await Quote.updateOne({ _id: req.params.quoteId }, quoteData);
    const getQuote = await Quote.findById(quote.id)
      .populate("creator")
      .populate("likes");
    const transformQuote = TransformQuote(getQuote);
    res.status(200).json({
      success: true,
      data: transformQuote,
      message: `you have updated quote `,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.AddLike = async (req, res) => {
  const currentUser_id = req.user.id;
  try {
    const quote = await Quote.findById(req.params.quoteId);
    if (!quote) return res.status(404).json({ error: "quote not found" });

    let isLike = checkAlreadyLike(quote, currentUser_id);
    if (isLike.data)
      return res.status(400).json({ error: "you already like this quote" });

    quote.likes.push(currentUser_id);
    await quote.save();

    const getQuote = await Quote.findById(req.params.quoteId)
      .populate("creator")
      .populate("likes");
    const transformQuote = TransformQuote(getQuote);
    res.status(200).json({
      data: transformQuote,
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
    const quote = await Quote.findById(req.params.quoteId);
    if (!quote) return res.status(404).json({ error: "quote not found" });

    let isLike = checkAlreadyLike(quote, currentUser_id);
    if (!isLike.data)
      return res.status(400).json({ error: "you still not like this quote" });

    quote.likes.splice(isLike.index, 1);
    await quote.save();
    const getQuote = await Quote.findById(req.params.quoteId)
      .populate("creator")
      .populate("likes");
    const transformQuote = TransformQuote(getQuote);
    res.status(200).json({
      data: transformQuote,
      message: "remove like",
    });
  } catch (err) {
    console.log(err);
  }
};
