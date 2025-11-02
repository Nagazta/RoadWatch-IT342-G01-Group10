import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style/Registrationpage.css';
import Navbar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import authService from '../../services/api/authService';

function Registrationpage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validation
        if (password !== confirmPassword) {
            setError("Passwords don't match!");
            return;
        }
        if (!agreeToTerms) {
            setError("You must agree to the Terms and Privacy Policy.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);

        try {
            console.log('🔵 Registration attempt:', { fullName, email, contactNumber });
            
            const result = await authService.register({
                username: email.split('@')[0], // Generate username from email
                name: fullName,
                email: email,
                password: password,
                contact: contactNumber,
            });

            if (result.success) {
                console.log('✅ Registration successful');
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                console.error('❌ Registration failed:', result.error);
                setError(result.error);
            }
        } catch (err) {
            console.error('❌ Unexpected error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setError('');
        setLoading(true);

        try {
            const result = await authService.loginWithGoogle();
            if (!result.success) {
                setError(result.error);
            }
        } catch (err) {
            setError('Google signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <Navbar />
            
            {/* --- THIS IS THE 1 CONTAINER WE WILL SPLIT --- */}
            <div className="registration-main-content">
                {/* --- CHILD 1: THE FORM AREA --- */}
                <div className="registration-form-area">
                    <div className="auth-card">
                        <h2>Join RoadWatch</h2>
                        <p className="auth-subtitle">Help build safer communities by reporting road damage and tracking improvements in your area.</p>
                        
                        {/* Error Message */}
                        {error && (
                            <div className="error-message">
                                <span className="error-icon">⚠️</span>
                                {error}
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="success-message">
                                <span className="success-icon">✅</span>
                                Registration successful! Redirecting to login...
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

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

                            <div className="form-row">
                                <div className="input-group">
                                    <label htmlFor="password">Create Password</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type="password"
                                            id="password"
                                            placeholder="Create password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            disabled={loading}
                                            minLength={6}
                                        />
                                        <span className="password-toggle">👁️</span>
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            placeholder="Confirm password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            disabled={loading}
                                        />
                                        <span className="password-toggle">👁️</span>
                                    </div>
                                </div>
                            </div>

                            <div className="input-group">
                                <label htmlFor="contactNumber">Contact Number</label>
                                <input
                                    type="tel"
                                    id="contactNumber"
                                    placeholder="Enter your contact number"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-options terms-agreement">
                                <label className="checkbox-container">
                                    I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                                    <input
                                        type="checkbox"
                                        checked={agreeToTerms}
                                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                                        required
                                        disabled={loading}
                                    />
                                    <span className="checkmark"></span>
                                </label>
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-primary auth-btn"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        <p className="auth-switch">
                            Already have an account? <Link to="/login">Sign in</Link>
                        </p>

                        <div className="divider"></div>

                        <button 
                            className="btn btn-secondary google-btn"
                            onClick={handleGoogleSignup}
                            disabled={loading}
                        >
                            <span className="google-icon">G</span>
                            Continue with Google
                        </button>
                    </div>
                </div>

                {/* --- CHILD 2: THE SIDEBAR --- */}
                <div className="registration-sidebar">
                    <div className="sidebar-illustration">
                        <div className="illustration-placeholder"></div>
                    </div>
                    <h3 className="sidebar-title">Report. Track. Improve.</h3>
                    <p className="sidebar-description">
                        Join thousands of citizens making their communities safer by reporting
                        road damage and tracking repairs in real-time.
                    </p>
                    <div className="sidebar-stats">
                        <div className="stat-item">
                            <h4>12,847</h4>
                            <p>Reports in total</p>
                        </div>
                        <div className="stat-item">
                            <h4>9,234</h4>
                            <p>Issues Resolved</p>
                        </div>
                        <div className="stat-item">
                            <h4>3.2 days</h4>
                            <p>Avg Resolution</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Registrationpage;