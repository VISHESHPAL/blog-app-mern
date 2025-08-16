import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
  
    // console.log(token);
  
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized ",
      });
    }
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    if (!decoded) {
      return res.status(404).json({
        success: false,
        message: "Invalid Token",
      });
    }
  
    const user =  await User.findById(decoded.id).select("-password");
  
    if(!user){
       return res.status(404).json({
          success : false ,
          message : "User Not Found !"
       })
    }
  
    req.user = user ;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Auth Error !",
      error: error.message,
    });
  }
};
