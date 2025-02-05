import React, { useState } from "react";
import "../../css/auth.css";
import axios from "axios";

const LoginForm = ({
  errorMessage = "",
  validationErrors = [],
  oldInput = {},
  csrfToken,
}) => {
  const [formData, setFormData] = useState({
    email: oldInput.email || "",
    password: oldInput.password || "",
  });
  const { email, password } = formData;
  const [error, setError] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === "" || password === "" || confirmPassword === "") {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    // Kiểm tra mật khẩu xác nhận
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        { email, password, confirmPassword },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Signup successful:", response.data);
      // Xử lý sau khi đăng ký thành công
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong!");
      }
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
