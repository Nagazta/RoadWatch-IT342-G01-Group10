import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    alert('Configuration Error: Missing Supabase keys. Check console for details.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const authService = {
    // -----------------------------
    // Email/Password login via backend
    // -----------------------------
    login: async (email, password, config = {}) => {
        // 1. DEBUGGING: Check if data is actually arriving here
        console.log("Attempting login with:", { email, password });

        if (!email || !password) {
            return { success: false, error: "Email and Password are required" };
        }

        try {
            const response = await axios.post(
                `${API_URL}/auth/local-login`,
                { email, password }, // <--- This is the "Request Body"
                config
            );

            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            return { success: true, data: response.data };
        } catch (error) {
            console.error('❌ Login failed:', error);

            // 2. UI FIX: Stop the "Required request body..." error from showing to the user
            // If the backend sends a 400/Bad Request, show a custom message
            let errorMessage = 'Invalid email or password';

            if (error.response && error.response.data && error.response.data.message) {
                // If the error is that technical Java string, hide it
                if (error.response.data.message.includes("Required request body is missing")) {
                    errorMessage = errorMessage;
                } else {
                    // Otherwise, use the backend message
                    errorMessage = error.response.data.message;
                }
            }

            // 3. LOGIC FIX: You had "success: true" here previously.
            // It MUST be "success: false" so your frontend knows it failed.
            return {
                success: false,
                error: errorMessage,
            };
        }
    },





    // -----------------------------
    // Register new user
    // -----------------------------
    register: async (userData) => {
        try {
            // Step 1: Send to backend to create user in DB
            const response = await axios.post(`${API_URL}/api/users/add`, {
                username: userData.username,
                name: userData.name,
                email: userData.email,
                password: userData.password,
                role: 'CITIZEN',
                contact: userData.contact || '',
            });

            return {
                success: true,
                message: 'Registration successful!',
                data: response.data,
            };
        } catch (error) {
            console.error('❌ Registration failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Registration failed',
            };
        }
    },

    // -----------------------------
    // Google OAuth login
    // -----------------------------
    loginWithGoogle: async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    }
                },
            });

            if (error) {
                console.error('❌ Supabase OAuth error:', error);
                throw error;
            }

            console.log('✅ Google OAuth initiated successfully');
            return { success: true, data };
        } catch (error) {
            console.error('❌ Google login failed:', error);
            return {
                success: false,
                error: error.message || 'Google login failed',
            };
        }
    },

    // -----------------------------
    // Handle OAuth callback
    // -----------------------------
    handleOAuthCallbackWithHash: async (hash) => {
        try {
            const hashParams = new URLSearchParams(hash.substring(1));
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');

            if (!accessToken || !refreshToken) {
                throw new Error('Missing access_token or refresh_token in callback');
            }

            // Set session in Supabase
            const { error: sessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            });
            if (sessionError) throw sessionError;

            // Sync with backend and get JWT
            const response = await axios.post(`${API_URL}/auth/google`, { accessToken });

            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('supabaseToken', accessToken);

            return { success: true, data: response.data };
        } catch (error) {
            console.error('❌ OAuth callback failed:', error);
            return { success: false, error: error.message || 'OAuth callback failed' };
        }
    },


    // -----------------------------
    // Logout
    // -----------------------------
    logout: async () => {
        try {
            await supabase.auth.signOut();
            localStorage.removeItem('accessToken');
            localStorage.removeItem('supabaseToken');
            localStorage.removeItem('user');
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // -----------------------------
    // Current user helpers
    // -----------------------------
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },
    isAuthenticated: () => !!localStorage.getItem('accessToken'),
};

export default authService;
