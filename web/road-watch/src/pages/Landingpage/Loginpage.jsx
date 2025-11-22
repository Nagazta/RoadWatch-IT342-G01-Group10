import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style/Loginpage.css'; 
import Navbar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import authService from '../../services/api/authService';

function Loginpage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    // Helper function to handle successful login
    const handleLoginSuccess = (token, role) => {
        localStorage.setItem("token", token);
        localStorage.setItem("userRole", role); // Save user role for ProtectedRoute
        sessionStorage.removeItem("authInProgress");

        if (role === 'ADMIN') {
            navigate('/admin/dashboard');
        } else if (role === 'INSPECTOR') {
            navigate('/inspector/dashboard');
        } else {
            navigate('/citizen/dashboard');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        sessionStorage.setItem("authInProgress", "true");

        try {
            const response = await authService.login(email, password, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.success) {
                handleLoginSuccess(response.data.token, response.data.user.role);
            } else {
                setError(response.error);
                sessionStorage.removeItem("authInProgress");
            }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred. Please try again.');
            sessionStorage.removeItem("authInProgress");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        sessionStorage.setItem("authInProgress", "true");

        try {
            const result = await authService.loginWithGoogle();

            if (result.success) {
                handleLoginSuccess(result.data.token, result.data.user.role);
            } else {
                setError(result.error);
                sessionStorage.removeItem("authInProgress");
            }
        } catch (err) {
            sessionStorage.removeItem("authInProgress");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <Navbar />

            <div className="login-main-content">

                {/* --- CHILD 1: Sidebar (on the left) --- */}
                <div className="login-sidebar">
                    <div className="sidebar-illustration">
                        <div className="illustration-placeholder"></div>
                    </div>

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

                        {/* Error Message */}
                        {error && (
                            <div className="error-message">
                                <span className="error-icon">⚠️</span>
                                {error}
                            </div>
                        )}

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
                                    disabled={loading}
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
                                        disabled={loading}
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
                                        disabled={loading}
                                    />
                                    <span className="checkmark"></span>
                                </label>
                                <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-primary auth-btn"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </form>

                        <div className="divider">Or continue with Google</div>

                        <button 
                            className="btn btn-secondary google-btn"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                        >
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
