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
