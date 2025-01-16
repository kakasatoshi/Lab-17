import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NewPassword = ({ csrfToken }) => {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [passwordToken, setPasswordToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy userId và passwordToken từ query params hoặc props
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    setUserId(params.get("userId"));
    setPasswordToken(params.get("passwordToken"));
  }, [location]);

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("/new-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken,
      },
      body: JSON.stringify({
        password,
        userId,
        passwordToken,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          navigate("/login"); // Điều hướng về trang đăng nhập sau khi cập nhật mật khẩu thành công
        } else {
          setErrorMessage(data.message || "Something went wrong!");
        }
      })
      .catch((error) => {
        console.error("Error updating password:", error);
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
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <input type="hidden" name="userId" value={userId} />
        <input type="hidden" name="passwordToken" value={passwordToken} />
        <input type="hidden" name="_csrf" value={csrfToken} />
        <button className="btn" type="submit">
          Update Password
        </button>
      </form>
    </main>
  );
};

export default NewPassword;
