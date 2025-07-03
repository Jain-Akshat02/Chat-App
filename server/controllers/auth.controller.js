import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { generateToken } from "../config/utils.js";
import cloudinary from "../config/cloudinary.js";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";

// Set up storage engine for multer
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const signup = async (req, res) => {
  const { fullName, password, email } = req.body;
  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists, Login." });
    }
    //for new user

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashPassword,
    });
    await newUser.save();

    if (!newUser) {
      return res.status(400).json({ message: "User not created, try again." });
    }
    //generate token
    generateToken(newUser._id, res);
    res.status(201).json({
      message: "User created successfully",
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      // profilePicture: newUser.profilePicture,
    });
  } catch (error) {
    console.error("Error in signup:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found, please register." });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Invalid password, please try again." });
    }
    //generate token
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.send(500).json({ message: "error logging out" });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    const {profilePic } = req.body;
    const userId = req.user._id;
    console.log("User ID:", userId);
    console.log("route 1 reached");
    
    if (!profilePic) {
      return res.status(400).json({ message: error.message });
    }
    console.log('route 2 reached');
    
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    console.log("route 3 reached");
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    console.log("reached here 2");
    
    return res.status(200).json({
      message: "Profile picture updated successfully",
      user: updateUser
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error updating profile picture",
        error: error.message,
      });
  }
};
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Eror in checkAuth:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
    if (!cloudinaryResponse) {
      return res.status(500).json({ message: "Failed to upload file to Cloudinary" });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.profilePic = cloudinaryResponse.secure_url;
    await user.save();
    res.status(200).json({ profilePic: user.profilePic });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
