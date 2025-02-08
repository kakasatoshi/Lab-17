import React, { useState } from "react";
import { useCsrf } from "../context/CsrfContext.js";
import useCsrfToken from "../../http/useCsrfToken.js";

function SignupForm({ validationErrors, oldInput }) {
  const [formData, setFormData] = useState({
    email: oldInput?.email || "",
    password: oldInput?.password || "",
    confirmPassword: oldInput?.confirmPassword || "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const csrfToken = useCsrf();
  console.log("csrfToken:", csrfToken);

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

    if (!csrfToken) {
      setErrorMessage("Lỗi hệ thống! Không tìm thấy CSRF Token.");
      setIsLoading(false);
      return;
    }

    console.log("formData:", formData);
    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({})); // Tránh lỗi JSON parse
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong!");
      }

      alert("Signup successful!");
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
        <input type="hidden" name="_csrf" value={csrfToken} />
        <button className="btn" type="submit" disabled={isLoading}>
          {isLoading ? "Đang đăng ký..." : "Signup"}
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
