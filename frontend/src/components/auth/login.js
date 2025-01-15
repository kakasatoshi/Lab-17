import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/forms.css";
import useCsrfToken from "../../http/useCsrfToken";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { csrfToken, error } = useCsrfToken("http://localhost:5000/csrf-token");

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken, // Thêm token vào header
          },
          withCredentials: true, // Gửi cookie session
        }
      );
      console.log("Login successful:", response.data);
      alert("Login successful");
      window.location.href = "/";
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
      <main>
        {errorMessage && (
          <div className="user-message user-message--error">{errorMessage}</div>
        )}
        <form className="login-form" onSubmit={handleLogin}>
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
          {/* Hidden CSRF Token */}
          <input type="hidden" name="_csrf" value={csrfToken} />
          <button className="btn" type="submit">
            Login
          </button>
        </form>
      </main>
    </div>
  );
};

export default LoginForm;
