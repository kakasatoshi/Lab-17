const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail", // Bạn có thể dùng SMTP khác
      auth: {
        user: "cbs.uv2@gmail.com", // Thay bằng email của bạn
        pass: "Mnbv@0987", // Thay bằng mật khẩu ứng dụng của bạn
      },
    });

    let mailOptions = {
      from: "cbs.uv2@gmail.com",
      to: to,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email đã gửi thành công!");
  } catch (error) {
    console.error("Lỗi gửi email:", error);
  }
};

module.exports = sendEmail;
