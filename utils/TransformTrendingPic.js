module.exports = (image) => {
  return {
    id: image.id,
    title: image.title,
    image: image.image,
    createdAt: image.createdAt,
    creator: {
      id: image.creator.id,
      name: image.creator.name,
      email: image.creator.email,
    },
    likes: image.likes.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    })),
  };
};
