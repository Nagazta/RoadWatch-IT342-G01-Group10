import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style/Registrationpage.css'; // Import the specific CSS

import Navbar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';

function Registrationpage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        if (!agreeToTerms) {
            alert("You must agree to the Terms and Privacy Policy.");
            return;
        }
        console.log('Register attempt:', { fullName, email, password, contactNumber, agreeToTerms });
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
                                    />
                                    <span className="checkmark"></span>
                                </label>
                            </div>

                            <button type="submit" className="btn btn-primary auth-btn">
                                Create Account
                            </button>
                        </form>

                        <p className="auth-switch">
                            Already have an account? <Link to="/LandingPage/Loginpage">Sign in</Link>
                        </p>

                        <div className="divider"></div>

                        <button className="btn btn-secondary google-btn">
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