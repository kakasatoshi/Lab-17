import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = ({ csrfToken }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Form validation (simplified for example)
    if (formData.password !== formData.confirmPassword) {
      setValidationErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          navigate("/login"); // Redirect to login after successful signup
        } else {
          setErrorMessage(data.message || "Something went wrong!");
        }
      })
      .catch((error) => {
        console.error("Error during signup:", error);
        setErrorMessage("Something went wrong. Please try again.");
      });
  };

  return (
    <main>
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
            onChange={handleInputChange}
            className={validationErrors.email ? "invalid" : ""}
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
            className={validationErrors.password ? "invalid" : ""}
          />
        </div>
        <div className="form-control">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={validationErrors.confirmPassword ? "invalid" : ""}
          />
        </div>
        <input type="hidden" name="_csrf" value={csrfToken} />
        <button className="btn" type="submit">
          Signup
        </button>
      </form>
    </main>
  );
};

export default Signup;
