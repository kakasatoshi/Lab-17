import React, { useState } from "react";
import axios from "axios";
import "../../css/forms.css";
import useCsrfToken from "../../http/useCsrfToken";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { csrfToken, error } = useCsrfToken("http://localhost:5000/csrf-token"); // Nếu cần CSRF token

  const handleSignup = async (event) => {
    event.preventDefault();

    if (email === "" || password === "" || confirmPassword === "") {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    // Kiểm tra mật khẩu xác nhận
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/signup",
        { email, password, confirmPassword },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Signup successful:", response.data);
      // Xử lý sau khi đăng ký thành công
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Something went wrong!");
      }
    }
  };

  return (
    <div>
      {/* Head Section */}
      <head>
        <link rel="stylesheet" href="/css/forms.css" />
        <link rel="stylesheet" href="/css/auth.css" />
      </head>

      {/* Navigation - Có thể đặt trong một Component khác */}
      <nav>{/* Include Navigation Content */}</nav>

      {/* Main Content */}
      <main>
        {errorMessage && (
          <div className="user-message user-message--error">{errorMessage}</div>
        )}
        <form className="login-form" onSubmit={handleSignup}>
          <div className="form-control">
            <label htmlFor="email">E-Mail</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {/* Hidden CSRF Token */}
          <input type="hidden" name="_csrf" value={csrfToken} />
          <button className="btn" type="submit">
            Signup
          </button>
        </form>
      </main>

      {/* Footer Section */}
      <footer>{/* Include Footer Content */}</footer>
    </div>
  );
};

export default SignupForm;
