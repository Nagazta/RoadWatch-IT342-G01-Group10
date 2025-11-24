import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "./styles/UnauthorizedUser.css";

const UnauthorizedUser = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we passed a "reason" via state, otherwise default to "access_denied"
    const reason = location.state?.reason || "access_denied";
    const userRole = localStorage.getItem("userRole");

    const content = {
        login_required: {
            title: "Login Required",
            message: "You must be logged in to access this page.",
            buttonText: "Go to Login",
            action: () => navigate('/login')
        },
        access_denied: {
            title: "Access Denied",
            message: "You do not have permission to view this page.",
            buttonText: "Go Back",
            action: () => {
                window.history.back();
            }
        }
    };

    const currentContent = content[reason] || content.access_denied;

    return (
        <div className="unauthorized-container">
            <div className="unauthorized-card">
                <span className="unauthorized-icon">🚫</span>

                <h2 className="unauthorized-title">
                    {currentContent.title}
                </h2>

                <p className="unauthorized-message">
                    {currentContent.message}
                </p>

                <button
                    className="unauthorized-btn"
                    onClick={currentContent.action}
                >
                    {currentContent.buttonText}
                </button>
            </div>
        </div>
    );
};

export default UnauthorizedUser;