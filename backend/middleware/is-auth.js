module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
  }
  next(); // Cho phép request tiếp tục nếu đã đăng nhập
};
