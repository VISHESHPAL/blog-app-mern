import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(401).json({
        success: false,
        message: "All Fields are Required ",
      });
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
      return res.status(400).json({
        success: false,
        message: " User Already Exist ! ",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully ! ",
      user,
    });
  } catch (error) {
    // console.log(error)
    return res.status(500).json({
      success: false,
      message: "Error Registering the User",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "All fields are required ! ",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid User Credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password Credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User Login Successfully ! ",
      user,
      token,
    });
  } catch (error) {
    // console.log(error)
    return res.status(500).json({
      success: false,
      message: "Error Logging  the User",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(201).json({
      success: true,
      message: "User Logout Successfully  !",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error Logouting  the User",
      error: error.message,
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    await User.findByIdAndDelete(userId);

    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: " User Account Deleted Successfully !",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error Deletting  the User",
      error: error.message,
    });
  }
};
