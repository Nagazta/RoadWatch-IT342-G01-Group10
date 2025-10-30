import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style/Loginpage.css'; 

import Navbar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';

function Loginpage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login attempt:', { email, password, rememberMe });
    };

    return (
        <div className="page-wrapper">
            <Navbar />

            <div className="login-main-content">

                {/* --- CHILD 1: Sidebar (on the left) --- */}
                <div className="login-sidebar">

                    {/* --- NEW GEOMETRIC ILLUSTRATION PLACEHOLDER --- */}
                    <div className="sidebar-illustration">
                        <div className="illustration-placeholder"></div>
                    </div>
                    {/* --- END NEW PLACEHOLDER --- */}

                    <div className="sidebar-content">
                        <h3>Road Watch</h3>
                        <p>Report road damage and help improve your community's infrastructure</p>

                        <div className="sidebar-features-box">
                            <div className="feature-item">
                                <span>Submit damage reports in seconds</span>
                            </div>
                            <div className="feature-item">
                                <span>Automatic location detection</span>
                            </div>
                            <div className="feature-item">
                                <span>Help improve local infrastructure</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* --- CHILD 2: Form Area (on the right) --- */}
                <div className="login-form-area">
                    <div className="auth-card">
                        <h2>Welcome Back</h2>
                        <p className="auth-subtitle">Sign in to your Road Watch account</p>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="password">Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-options">
                                <label className="checkbox-container">
                                    Remember me
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span className="checkmark"></span>
                                </label>
                                <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
                            </div>

                            <button type="submit" className="btn btn-primary auth-btn">
                                Sign in
                            </button>
                        </form>

                        <div className="divider">Or continue with Google</div>

                        <button className="btn btn-secondary google-btn">
                            <span>Continue with Google</span>
                        </button>

                        <p className="auth-switch">
                            Don't have an account? <Link to="/register">Sign up for free</Link>
                        </p>
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
}

export default Loginpage;