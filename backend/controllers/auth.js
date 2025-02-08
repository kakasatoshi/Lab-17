const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const sendEmail = require("../src/mailer");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: "UPCRSSKZC81WFVNH3ZG3LZCT",
    },
  })
);

exports.getLogin = (req, res) => {
  res.status(200).json({
    path: "/login",
    pageTitle: "Login",
    errorMessage: null,
    oldInput: { email: "", password: "" },
    validationErrors: [],
  });
};

exports.getSignup = (req, res) => {
  res.status(200).json({
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: null,
    oldInput: { email: "", password: "", confirmPassword: "" },
    validationErrors: [],
  });
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password },
      validationErrors: errors.array(),
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(422).json({
        errorMessage: "Invalid email or password.",
        oldInput: { email, password },
        validationErrors: [],
      });
    }

    const doMatch = await bcrypt.compare(password, user.password);
    if (!doMatch) {
      return res.status(422).json({
        errorMessage: "Invalid email or password.",
        oldInput: { email, password },
        validationErrors: [],
      });
    }

    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ error: "Session save failed" });
      }
      res.status(200).json({ success: true, message: "Login successful" });
    });
  } catch (err) {
    next(new Error(err));
  }
};

exports.postSignup = async (req, res, next) => {
  console.log("postsignup", req.body);
  const { email, password, confirmPassword, username = "User" } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password, confirmPassword },
      validationErrors: errors.array(),
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      cart: { items: [] },
    });
    await user.save();

    // Gửi email chào mừng
    await sendEmail(
      email,
      "Chào mừng bạn!",
      `Chào ${username}, cảm ơn bạn đã đăng ký!`
    );

    res.status(201).json({
      success: true,
      message: "Signup successful, please check your email!",
    });
  } catch (err) {
    next(new Error(err));
  }
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.status(200).json({ success: true, message: "Logged out successfully" });
  });
};

exports.postReset = async (req, res, next) => {
  try {
    const buffer = crypto.randomBytes(32);
    const token = buffer.toString("hex");

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ error: "Email not found" });
    }

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();

    await transporter.sendMail({
      to: req.body.email,
      from: "shop@node-complete.com",
      subject: "Password reset",
      html: `<p>You requested a password reset</p>
             <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>`,
    });

    res
      .status(200)
      .json({ success: true, message: "Password reset link sent" });
  } catch (err) {
    next(new Error(err));
  }
};

exports.postNewPassword = async (req, res, next) => {
  const { password, userId, passwordToken } = req.body;

  try {
    const user = await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    next(new Error(err));
  }
};
