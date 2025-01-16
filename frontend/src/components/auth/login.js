import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ csrfToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (response.ok) {
          navigate("/"); // Điều hướng về trang chủ sau khi đăng nhập thành công
        } else {
          return response.json().then((data) => {
            setErrorMessage(data.message || "Login failed!");
            setValidationErrors(data.errors || []);
          });
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        setErrorMessage("Something went wrong. Please try again.");
      });
  };

  const findValidationError = (field) => {
    return validationErrors.find((e) => e.param === field) ? "invalid" : "";
  };

  return (
    <main>
      {errorMessage && (
        <div className="user-message user-message--error">{errorMessage}</div>
      )}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input
            className={findValidationError("email")}
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
            className={findValidationError("password")}
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn" type="submit">
          Login
        </button>
      </form>
      <div className="centered">
        <a href="/reset">Reset Password</a>
      </div>
    </main>
  );
};

export default Login;
