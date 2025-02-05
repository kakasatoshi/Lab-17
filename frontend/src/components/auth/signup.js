import React, { useState } from "react";
import axios from "axios";

function SignupForm({ validationErrors, csrfToken, oldInput }) {
  const [formData, setFormData] = useState({
    email: oldInput?.email || "",
    password: oldInput?.password || "",
    confirmPassword: oldInput?.confirmPassword || "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  // const { email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., send data to API)
    if (
      formData.email === "" ||
      formData.password === "" ||
      formData.confirmPassword === ""
    ) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    // Kiểm tra mật khẩu xác nhận
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/signup",
        {
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
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

  const getInputClass = (field) => {
    return validationErrors?.some((error) => error.param === field)
      ? "invalid"
      : "";
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
            className={getInputClass("email")}
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
            className={getInputClass("password")}
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
            className={getInputClass("confirmPassword")}
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <input type="hidden" name="_csrf" value={csrfToken} />
        <button className="btn" type="submit">
          Signup
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
