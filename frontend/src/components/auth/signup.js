import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

function SignupForm({ validationErrors, oldInput }) {
  const navigate = useNavigate(); // ✅ Khai báo useNavigate

  const [formData, setFormData] = useState({
    email: oldInput?.email || "",
    password: oldInput?.password || "",
    confirmPassword: oldInput?.confirmPassword || "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      // Lấy CSRF token trước
      const csrfRes = await fetch("http://localhost:5000/csrf-token", {
        credentials: "include",
      });
      const { csrfToken } = await csrfRes.json();
      setCsrfToken(csrfToken);

      // Gửi request signup với CSRF token
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));
      setErrorMessage(data.errorMessage || "");

      if (!response.ok) {
        throw new Error(data.errorMessage || "Something went wrong!");
      }

      alert("Signup successful!");

      // ✅ Điều hướng sang trang đăng nhập sau khi đăng ký thành công
      navigate("/login");
    } catch (err) {
      setErrorMessage(err.message);
    }

    setIsLoading(false);
  };

  return (
    <div>
      {errorMessage && (
        <div className="user-message user-message--error">{errorMessage}</div>
      )}
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input
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
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="form-control">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button className="btn" type="submit" disabled={isLoading}>
          {isLoading ? "Đang đăng ký..." : "Signup"}
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
