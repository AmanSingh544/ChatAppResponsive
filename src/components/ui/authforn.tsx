import React, { useState } from "react";
import "./login.css";

function AuthForm({ onSubmit, isLogin, setIsLogin}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ username, password });
        setUsername("");
        setPassword("");
    };

    return (
        <>
            <div className="auth-page">
                <form onSubmit={handleSubmit} className="auth-form">
                    <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
                    <div className="form-group">
                        <input type="text" placeholder="Username" value={username}
                            onChange={(e) => setUsername(e.target.value)} required />
                        <input type="password" placeholder="Password" value={password}
                            onChange={(e) => setPassword(e.target.value)} required />
                        <button type="submit" className="btn">
                            {isLogin ? 'Login' : 'Register'}
                        </button>
                    </div>
                    <div className="toggle-auth">
                    <span className="toggle-btn"
                        onClick={() => setIsLogin((prev) => !prev)} >
                        {
                            isLogin ?
                                <p className="link-text">Don't have an account? Sign Up </p> : <p className="link-text"> Already have an account? Login </p>
                        }
                    </span>
                </div>
                </form>
            </div>
        </>)
}

export default AuthForm;
// This component is a simple authentication form that can be used for both login and registration.