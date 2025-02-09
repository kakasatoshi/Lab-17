import React, { useState } from "react";
import "../../css/auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const LoginForm = ({ validationErrors = [], oldInput = {} }) => {
  const [formData, setFormData] = useState({
    email: oldInput.email || "",
    password: oldInput.password || "",
  });

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();

  // const [confirmPassword, setConfirmPassword] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Lấy CSRF token trước
      const csrfRes = await fetch("http://localhost:5000/csrf-token", {
        credentials: "include",
      });
      const csrfData = await csrfRes.json();
      const csrfToken = csrfData.csrfToken; // ✅ Lưu vào biến trước

      console.log("CSRF Token:", csrfToken); // 🛠 Kiểm tra token có hợp lệ không

      // Gửi request đăng nhập
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken, // ✅ Dùng biến thay vì state
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log("Phản hồi từ server:", data);

      if (!response.ok) {
        throw new Error(data.errorMessage || "Lỗi đăng nhập!");
      }

      alert("Đăng nhập thành công!");
      window.location.href = "/"; // ✅ Chuyển hướng sau khi đăng nhập thành công
    } catch (error) {
      console.error("Lỗi khi gửi request:", error);
      setErrorMessage(error.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div>
      {errorMessage && (
        <div className="user-message user-message--error">{errorMessage}</div>
      )}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input
            className={
              validationErrors.some((e) => e.param === "email") ? "invalid" : ""
            }
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            className={
              validationErrors.some((e) => e.param === "password")
                ? "invalid"
                : ""
            }
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <input type="hidden" name="_csrf" value={csrfToken} />
        <button className="btn" type="submit">
          Login
        </button>
      </form>
      <div className="centered">
        <a href="/reset">Reset Password</a>
      </div>
    </div>
  );
};

export default LoginForm;
