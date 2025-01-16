const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: "YOUR_SENDGRID_API_KEY", // Replace with your API key
    },
  })
);

// Login
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ message: "Invalid email or password." });
      }
      bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save((err) => {
            if (err) console.log(err);
            res.status(200).json({ message: "Logged in successfully.", user });
          });
        } else {
          return res
            .status(422)
            .json({ message: "Invalid email or password." });
        }
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "Login failed.", error: err });
    });
};

// Signup
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then(() => {
      res.status(201).json({ message: "User created successfully!" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Signup failed.", error: err });
    });
};

// Logout
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.status(200).json({ message: "Logged out successfully." });
  });
};

// Reset Password
exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Reset token generation failed." });
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .json({ message: "No account with that email found." });
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
        return user.save();
      })
      .then(() => {
        res
          .status(200)
          .json({ message: "Password reset link sent successfully." });
        return transporter.sendMail({
          to: req.body.email,
          from: "shop@node-complete.com",
          subject: "Password reset",
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `,
        });
      })
      .catch((err) => {
        res.status(500).json({ message: "Reset password failed.", error: err });
      });
  });
};

// New Password
exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found or token expired." });
      }
      return bcrypt.hash(newPassword, 12).then((hashedPassword) => {
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        return user.save();
      });
    })
    .then(() => {
      res.status(200).json({ message: "Password updated successfully!" });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Updating password failed.", error: err });
    });
};
