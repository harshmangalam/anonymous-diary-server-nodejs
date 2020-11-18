const User = require("../models/UserModels")
const JWT_SECRET = process.env.JWT_SECRET
const jwt = require("jsonwebtoken")


module.exports = async (req,res,next) => {
  const header = req.get("Authorization")
  if(!header) return res.status(401).json({success:false,error:"login to proceed"})

  const token = header.split("Bearer ")[1]
  if(!token) return res.status(401).json({success:false,error:"login to proceed"})

  let decodedToken;
  try{
    decodedToken = jwt.decode(token,JWT_SECRET,)

  }catch(err){
    console.console.log(err);
    return res.status(401).json({success:false,error:"login to proceed"})
  }
  if(!decodedToken) return res.status(401).json({success:false,error:"login to proceed"})

  const user = await User.findById(decodedToken.userId)
  const transformUser = {
    id:user.id,
    name:user.name,
    email: user.email,
    admin:user.admin,
  }
  req.user = transformUser
  next()
}
