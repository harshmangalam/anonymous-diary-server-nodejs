module.exports = (article) => {
  return {
    id: article.id,
    title: article.title,
    body: {
      image: article.body.image,
      text: article.body.text,
    },
    tags: article.tags,
    creator: {
      id: article.creator.id,
      name: article.creator.name,
      email: article.creator.email,
      profile_pic:
        article.creator.profile_pic,
    },
    likes: article.likes.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    })),
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };
};
