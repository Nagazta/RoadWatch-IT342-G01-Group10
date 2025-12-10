import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/api/authService';

export const useLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('🔵 Login form submitted for:', email);
            
            // ✅ AUTO-DETECT: Check if it's an inspector email
            const isInspector = email.toLowerCase().includes('@inspector');
            
            let result;
            if (isInspector) {
                console.log('🔍 Detected INSPECTOR - Using /api/auth/login-inspector');
                result = await authService.loginInspector(email, password);
            } else {
                console.log('🔍 Detected CITIZEN/ADMIN - Using /api/auth/login');
                result = await authService.login(email, password);
            }

            if (result.success) {
                console.log('✅ Login successful, redirecting...');
                
                // Redirect based on role
                const userRole = result.data.user.role;
                
                if (userRole === 'ADMIN') {
                    navigate('/admin/dashboard');
                } else if (userRole === 'INSPECTOR') {
                    navigate('/inspector/dashboard');
                } else {
                    navigate('/dashboard');
                }
            } else {
                console.error('❌ Login failed:', result.error);
                setError(result.error);
            }
        } catch (err) {
            console.error('❌ Unexpected error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);

        try {
            const result = await authService.loginWithGoogle();
            
            if (!result.success) {
                setError(result.error);
            }
            // Google OAuth will redirect automatically
        } catch (err) {
            setError('Google login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        rememberMe,
        setRememberMe,
        loading,
        error,
        handleSubmit,
        handleGoogleLogin,
    };
};