import userModel from "../Models/user.model.js";
import redisClient from "../Services/redis.service.js";
import * as userService from "../Services/user.service.js";

export const createUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });
    const user = await userService.createUserService(email, password);
    const token = await user.generateJWT();
    delete user._doc.password;
    return res.cookie("token", token).status(200).send({ user });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isCheck = await user.isValidPassword(password);
    if (!isCheck) {
      return res.status(401).json({ message: "Invalid Credential" });
    }
    const token = await user.generateJWT();
    delete user._doc.password;
    return res.cookie("token", token).status(200).send({ user, token });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

export const logoutController = async (req, res) => {
  try {
    const token =
      req.cookies.token ||
      (req.header.authorization && req.header.authorization.split(" ")[1]);

      redisClient.set(token,"logout","EX",60*60*24);
      res.status(200).json({message:"Logout Successful"});
  } catch (error) {
    res.status(400).json(error.message);
  }
};
