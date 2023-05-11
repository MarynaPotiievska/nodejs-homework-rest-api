const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const Jimp = require("jimp");
const fs = require("fs");

require("dotenv").config();

const { SECRET_KEY } = process.env;

const { User } = require("../models/user");

const { ctrlWrapper, HttpError } = require("../helpers");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const newUser = await User.create({
    ...req.body,
    password: hashedPassword,
    avatarURL,
  });
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "10h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).end();
};

const current = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const updateUserSub = async (req, res) => {
  if (!req.body) {
    throw HttpError(400);
  }
  const { subscription } = req.body;
  const { _id, email } = req.user;
  await User.findByIdAndUpdate(_id, req.body);
  res.json({
    email,
    subscription,
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  console.log(req.file);
  const { path: tempPath, originalname } = req.file;
  const avatarsPath = path.join(__dirname, "../", "public", "avatars");
  const avatar = Jimp.read(originalname, (err, img) => {
    if (err) {
      throw HttpError(400);
    }
    img.resize(250, 250).write(`${_id}_${originalname}`);
  });
  const resultPath = path.join(avatarsPath, avatar);
  await fs.rename(tempPath, resultPath);
  const avatarURL = path.join("avatars", avatar);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({ avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  current: ctrlWrapper(current),
  updateUserSub: ctrlWrapper(updateUserSub),
  updateAvatar: ctrlWrapper(updateAvatar),
};
