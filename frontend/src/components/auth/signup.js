import React, { useState } from "react";
import axios from "axios";
import useCsrfToken from "../../http/useCsrfToken";

function SignupForm({ validationErrors, oldInput }) {
  const [formData, setFormData] = useState({
    email: oldInput?.email || "",
    password: oldInput?.password || "",
    confirmPassword: oldInput?.confirmPassword || "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  // const [validationErrors1, setValidationErrors] = useState({
  //   validationErrors,
  // });
  const [isLoading, setIsLoading] = useState(false);
  const { csrfToken, error } = useCsrfToken();
  console.log("csrfToken:", csrfToken);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getInputClass = (field) => {
    return validationErrors?.some((error) => error.param === field)
      ? "invalid"
      : "";
  };

  const getFieldError = (field) => {
    const error = validationErrors?.find((err) => err.param === field);
    return error ? error.msg : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    // if (
    //   formData.email === "" ||
    //   formData.password === "" ||
    //   formData.confirmPassword === ""
    // ) {
    //   setErrorMessage("Vui lòng nhập đầy đủ thông tin");
    //   setIsLoading(false);
    //   return;
    // }

    // if (formData.password !== formData.confirmPassword) {
    //   setErrorMessage("Passwords do not match.");
    //   setIsLoading(false);
    //   return;
    // }

    try {
      fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": "L7Z1i8TQ-mKsiPEaNmYyAXfN-86wQ81pslzA",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      })
        .then(async (response) => {
          const data = await response.json();
          console.log("Lỗi từ server:", data);
        })
        .catch((error) => console.error("Lỗi kết nối:", error));

      ///////////////

      // const response = await axios.post(
      //   "http://localhost:5000/auth/signup",
      //   {
      //     email: formData.email,
      //     password: formData.password,
      //     confirmPassword: formData.confirmPassword,
      //   },
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       "X-CSRF-Token": csrfToken,
      //     },
      //   }
      // );

      // console.log("Signup successful:", response);
    } catch (error) {
      // if (error.response) {
      //   const { errorMessage, validationErrors } = error.response.data;
      //   if (validationErrors) {
      //     const formattedErrors = {};
      //     validationErrors.forEach((err) => {
      //       formattedErrors[err.path] = err.msg;
      //     });
      //     setValidationErrors(formattedErrors);
      //   } else {
      //     setErrorMessage(errorMessage || "Có lỗi xảy ra!");
      //   }
      // } else {
      //   setErrorMessage("Lỗi kết nối đến server!");
      // }
    } finally {
      setIsLoading(false);
    }
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
          {getFieldError("email") && (
            <p className="error-text">{getFieldError("email")}</p>
          )}
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
          {getFieldError("password") && (
            <p className="error-text">{getFieldError("password")}</p>
          )}
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
          {getFieldError("confirmPassword") && (
            <p className="error-text">{getFieldError("confirmPassword")}</p>
          )}
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
