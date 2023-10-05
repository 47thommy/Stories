import userModel from "../models/user.js";
import jwt from "jsonwebtoken";
import express from "express";
const router = express.Router();
const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRETE, { expiresIn: "3d" });
};

export const signup = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const user = await userModel.signup(email, password, name);
    const token = generateToken(user._id);
    console.log(token);
    //send the email and the token back in the response
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.login(email, password);
    const token = generateToken(user._id);
    //send the email and the token back in the response
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export default router;
