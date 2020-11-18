module.exports = (quote) => {
  return {
    id: quote.id,
    title: quote.title,
    body: {
      image: quote.body.image,
      text: quote.body.text,
    },
    tags: quote.tags,
    creator: {
      id: quote.creator.id,
      name: quote.creator.name,
      email: quote.creator.email,
      profile_pic: quote.creator.profile_pic,
    },
    likes: quote.likes.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    })),
    createdAt: quote.createdAt,
    updatedAt: quote.updatedAt,
  };
};
