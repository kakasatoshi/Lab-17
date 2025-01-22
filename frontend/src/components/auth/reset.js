// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const ResetPassword = ({ csrfToken }) => {
//   const [email, setEmail] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     fetch("/reset", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "CSRF-Token": csrfToken,
//       },
//       body: JSON.stringify({ email }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.success) {
//           navigate("/login"); // Điều hướng về trang đăng nhập sau khi yêu cầu đặt lại mật khẩu thành công
//         } else {
//           setErrorMessage(data.message || "Something went wrong!");
//         }
//       })
//       .catch((error) => {
//         console.error("Error during password reset:", error);
//         setErrorMessage("Something went wrong. Please try again.");
//       });
//   };

//   return (
//     <main>
//       {errorMessage && (
//         <div className="user-message user-message--error">{errorMessage}</div>
//       )}
//       <form className="login-form" onSubmit={handleSubmit}>
//         <div className="form-control">
//           <label htmlFor="email">E-Mail</label>
//           <input
//             type="email"
//             name="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>
//         <input type="hidden" name="_csrf" value={csrfToken} />
//         <button className="btn" type="submit">
//           Reset Password
//         </button>
//       </form>
//     </main>
//   );
// };

// export default ResetPassword;

import React, { useState } from 'react';

const ResetPasswordForm = ({ userId, passwordToken, csrfToken }) => {
    const [password, setPassword] = useState('');

    const handleChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit form logic here
    };

    return (
        <div>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        name="password" 
                        id="password" 
                        value={password}
                        onChange={handleChange}
                    />
                </div>
                <input type="hidden" name="userId" value={userId} />
                <input type="hidden" name="passwordToken" value={passwordToken} />
                <input type="hidden" name="_csrf" value={csrfToken} />
                <button className="btn" type="submit">Update Password</button>
            </form>
        </div>
    );
};

export default ResetPasswordForm;
