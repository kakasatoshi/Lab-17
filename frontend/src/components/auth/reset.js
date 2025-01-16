import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = ({ csrfToken }) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          navigate("/login"); // Điều hướng về trang đăng nhập sau khi yêu cầu đặt lại mật khẩu thành công
        } else {
          setErrorMessage(data.message || "Something went wrong!");
        }
      })
      .catch((error) => {
        console.error("Error during password reset:", error);
        setErrorMessage("Something went wrong. Please try again.");
      });
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
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <input type="hidden" name="_csrf" value={csrfToken} />
        <button className="btn" type="submit">
          Reset Password
        </button>
      </form>
    </main>
  );
};

export default ResetPassword;
