import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Create this CSS file

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email === 'admin@i' && password === '1234') {
            // Redirect to home page
            navigate('/home');
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="login-button" type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
