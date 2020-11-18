module.exports = (blog) => {
  return {
    id: blog.id,
    title: blog.title,
    body: {
      image: blog.body.image,
      text: blog.body.text,
    },
    tags: blog.tags,
    creator: {
      id: blog.creator.id,
      name: blog.creator.name,
      email: blog.creator.email,
    },
    likes: blog.likes.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    }),
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
  };
};
