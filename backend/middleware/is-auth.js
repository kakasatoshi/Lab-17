const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization;
  console.log(token, req.cookies.token , req.headers.authorization,"");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Không có token, vui lòng đăng nhập!" });
  }

  try {
    const decoded = jwt.verify(token, "MẬT_KHẨU_BÍ_MẬT"); // Kiểm tra JWT
    req.userId = decoded.userId; // Lưu userId vào request
    next();
  } catch (error) {
    console.error("🔥 Token không hợp lệ:", error);
    return res.status(403).json({ message: "Token không hợp lệ!" });
  }
};
