const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail", // Bạn có thể dùng SMTP khác
      auth: {
        user: "taiddfx21231@funix.edu.vn", // Thay bằng email của bạn
        pass: "kqso rtny ljpp tlbe", // Thay bằng mật khẩu ứng dụng của bạn
      },
    });

    let mailOptions = {
      from: "taiddfx21231@funix.edu.vn",
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
