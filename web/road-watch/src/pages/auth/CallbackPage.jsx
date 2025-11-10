import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/api/authService';

// Capture tokens IMMEDIATELY before React can clear them
const capturedHash = window.location.hash;

function CallbackPage() {
    const [status, setStatus] = useState('Processing login...');
    const [details, setDetails] = useState('');
    const navigate = useNavigate();
    const hasProcessed = useRef(false); // Prevent double processing in StrictMode

    useEffect(() => {
        // Only process once
        if (hasProcessed.current) {
            return;
        }        
        hasProcessed.current = true;
        handleCallback();
    }, []);

    const handleCallback = async () => {
        try {
            setDetails('Verifying authentication...');
            
            // Use the captured hash instead of current window.location.hash
            const result = await authService.handleOAuthCallbackWithHash(capturedHash);

            if (result.success) {
                setStatus('Login successful!');
                setDetails(`Welcome ${result.data.user.name || result.data.user.email}!`);
                
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
                setStatus('Login failed');
                setDetails(result.error || 'An error occurred during login');
                setTimeout(() => navigate('/login'), 3000);
            }
        } catch (error) {
            console.error('❌ Unexpected error in callback:', error);
            setStatus('An error occurred');
            setDetails(error.message || 'Please try again');
            setTimeout(() => navigate('/login'), 3000);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            gap: '20px',
            backgroundColor: '#f5f5f5',
            padding: '20px'
        }}>
            <div style={{ 
                fontSize: '64px',
                animation: status === 'Login successful!' ? 'none' : 'spin 2s linear infinite'
            }}>
                {status === 'Login successful!' ? '✅' : '🔄'}
            </div>
            <h2 style={{ 
                fontSize: '24px',
                color: '#333',
                fontWeight: '500',
                textAlign: 'center'
            }}>
                {status}
            </h2>
            {details && (
                <p style={{
                    fontSize: '16px',
                    color: '#666',
                    textAlign: 'center',
                    maxWidth: '400px'
                }}>
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

export default CallbackPage;