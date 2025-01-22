import React, { useState } from 'react';

const LoginForm = ({ errorMessage = '', validationErrors = [], oldInput = {}, csrfToken }) => {
    const [formData, setFormData] = useState({
        email: oldInput.email || '',
        password: oldInput.password || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit form logic here
    };

    return (
        <div>
            {errorMessage && <div className="user-message user-message--error">{errorMessage}</div>}
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-control">
                    <label htmlFor="email">E-Mail</label>
                    <input 
                        className={validationErrors.some(e => e.param === 'email') ? 'invalid' : ''}
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
                        className={validationErrors.some(e => e.param === 'password') ? 'invalid' : ''}
                        type="password" 
                        name="password" 
                        id="password" 
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <input type="hidden" name="_csrf" value={csrfToken} />
                <button className="btn" type="submit">Login</button>
            </form>
            <div className="centered">
                <a href="/reset">Reset Password</a>
            </div>
        </div>
    );
};

export default LoginForm;
