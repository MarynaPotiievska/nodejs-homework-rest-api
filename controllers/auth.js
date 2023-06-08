const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");

require("dotenv").config();

const { SECRET_KEY } = process.env;

const { User } = require("../models/user");

const { ctrlWrapper, HttpError, sendEmail } = require("../helpers");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();
  const avatarURL = gravatar.url(email);
  const newUser = await User.create({
    ...req.body,
    password: hashedPassword,
    verificationToken,
    avatarURL,
  });
  await sendEmail({
    to: email,
    subject: "Email verification",
    html: `<a href="${process.env.BASE_NAME}/api/users/verify/${verificationToken}">Please, click to verify</a>`,
  });
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const verifyByToken = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404);
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  res.json({ message: "Verification successful" });
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw HttpError(400, "missing required field email");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404);
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  await sendEmail({
    to: email,
    subject: "Email verification",
    html: `<a href="${process.env.BASE_NAME}/api/users/verify/${user.verificationToken}">Please, click to verify</a>`,
  });
  res.json({ message: "Verification email sent" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email is not verified");
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
  if (!req.file) {
    throw HttpError(400, "The file must be downloaded");
  }
  const { path: tempPath, originalname } = req.file;
  const avatarsPath = path.join(__dirname, "../", "public", "avatars");
  const img = async () => {
    const image = await Jimp.read(tempPath);
    await image.resize(250, 250);
    return await image.write(path.join(avatarsPath, `${_id}_${originalname}`));
  };
  await img();

  const avatarURL = path.join("avatars", `${_id}_${originalname}`);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({ avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  verifyByToken: ctrlWrapper(verifyByToken),
  resendVerificationEmail: ctrlWrapper(resendVerificationEmail),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  current: ctrlWrapper(current),
  updateUserSub: ctrlWrapper(updateUserSub),
  updateAvatar: ctrlWrapper(updateAvatar),
};
