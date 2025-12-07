import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/api/authService';

function CallbackPage() {
    const [status, setStatus] = useState('Processing login...');
    const [details, setDetails] = useState('');
    const navigate = useNavigate();
    const hasProcessed = useRef(false);

    useEffect(() => {
        // Prevent double execution in React StrictMode
        if (hasProcessed.current) return;
        hasProcessed.current = true;

        sessionStorage.setItem("authInProgress", "true");
        handleCallback();
    }, []);

    const handleCallback = async () => {
        try {
            console.log('🔄 Processing OAuth callback...');
            setDetails('Verifying authentication...');

            // Call the handleOAuthCallback from authService
            const result = await authService.handleOAuthCallback();

            if (result.success) {
                // Save token & role (already saved in authService, but double-check)
                localStorage.setItem("token", result.data.token);
                localStorage.setItem("userRole", result.data.user.role);
                localStorage.setItem("adminId", result.data.user.id); // For consistency
                sessionStorage.removeItem("authInProgress");

                setStatus('Login successful! ✅');
                setDetails(`Welcome ${result.data.user.name || result.data.user.email}!`);

                console.log('✅ OAuth login successful');
                console.log('User:', result.data.user);
                console.log('Role:', result.data.user.role);

                // Redirect based on role
                const userRole = result.data.user.role;
                setTimeout(() => {
                    if (userRole === 'ADMIN') {
                        navigate('/admin/dashboard');
                    } else if (userRole === 'INSPECTOR') {
                        navigate('/inspector/dashboard');
                    } else {
                        navigate('/citizen/dashboard');
                    }
                }, 1500);
            } else {
                console.error('❌ OAuth callback failed:', result.error);
                sessionStorage.removeItem("authInProgress");
                setStatus('Login failed ❌');
                setDetails(result.error || 'An error occurred during login');
                setTimeout(() => navigate('/login'), 3000);
            }
        } catch (error) {
            console.error('❌ Unexpected error in callback:', error);
            sessionStorage.removeItem("authInProgress");
            setStatus('An error occurred ❌');
            setDetails(error.message || 'Please try again');
            setTimeout(() => navigate('/login'), 3000);
        }
    };

    return (
        <div style={styles.container}>
            <div style={{
                ...styles.spinner,
                animation: status.includes('successful') ? 'none' : 'spin 2s linear infinite'
            }}>
                {status.includes('successful') ? '✅' : status.includes('failed') || status.includes('error') ? '❌' : '🔄'}
            </div>
            <h2 style={styles.status}>
                {status}
            </h2>
            {details && (
                <p style={styles.details}>
                    {details}
                </p>
            )}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '20px',
        backgroundColor: '#f5f5f5',
        padding: '20px'
    },
    spinner: {
        fontSize: '64px',
        transition: 'all 0.3s ease'
    },
    status: {
        fontSize: '24px',
        color: '#333',
        fontWeight: '500',
        textAlign: 'center',
        margin: 0
    },
    details: {
        fontSize: '16px',
        color: '#666',
        textAlign: 'center',
        maxWidth: '400px',
        margin: 0
    }
};

export default CallbackPage;