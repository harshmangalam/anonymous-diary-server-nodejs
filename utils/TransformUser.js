module.exports = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profile_pic: user.profile_pic,
    bio: user.bio,
    online: user.online,
    admin: user.admin,
    social: {
      facebook: user.social.facebook,
      instagram: user.social.instagram,
      phone: user.social.phone,
      address: user.social.address,
    },
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
