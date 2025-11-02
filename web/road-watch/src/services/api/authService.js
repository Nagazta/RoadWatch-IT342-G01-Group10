import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) { 
    alert('Configuration Error: Missing Supabase keys. Check console for details.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


const authService = {
    // Register new user
    register: async (userData) => {
        try {
       

            // Step 1: Create user in Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: userData.email,
                password: userData.password,
                options: {
                    data: {
                        username: userData.username,
                        name: userData.name,
                        contact: userData.contact,
                    }
                }
            });

            if (authError) {
                console.error('❌ Supabase Auth Error:', authError);
                throw authError;
            }

         

            // Step 2: Send to backend to create database record
            const response = await axios.post(`${API_URL}/users/add`, {
                username: userData.username,
                name: userData.name,
                email: userData.email,
                password: userData.password,
                role: 'CITIZEN',
                contact: userData.contact || '',
            });

           

            return {
                success: true,
                message: 'Registration successful! Please check your email to verify your account.',
                data: authData,
            };
        } catch (error) {
            console.error('❌ Registration failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Registration failed',
            };
        }
    },

    // Login with email/password
    login: async (email, password) => {
        try {
            const { data: supabaseData, error: supabaseError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (supabaseError) {
                console.error('❌ Supabase login error:', supabaseError);
                throw supabaseError;
            }
         
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password,
            });

            console.log('✅ Backend login successful');

            // Step 3: Store tokens and user data
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('supabaseToken', supabaseData.session.access_token);

            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            console.error('❌ Login failed:', error);
            return {
                success: false,
                error: error.response?.data || error.message || 'Invalid email or password',
            };
        }
    },

    // Login with Google OAuth
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

    // Handle OAuth callback
    handleOAuthCallback: async () => {
        try {
            
            // Parse the hash parameters
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');
            const expiresAt = hashParams.get('expires_at');
            const expiresIn = hashParams.get('expires_in');
            const providerToken = hashParams.get('provider_token');
            

            if (!accessToken || !refreshToken) {
                console.error('❌ Missing required tokens in URL hash');
                throw new Error('Missing access_token or refresh_token in callback');
            }

            // Manually set the session in Supabase
            console.log('📝 Setting session in Supabase...');
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            });

            if (sessionError) {
                console.error('❌ Error setting session:', sessionError);
                throw sessionError;
            }

            // Now send to backend to sync/create user
            const response = await axios.post(`${API_URL}/auth/google`, {
                accessToken: accessToken,
            });

            // Store tokens and user data
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('supabaseToken', accessToken);

            // Clear the hash from URL (clean up)
            window.history.replaceState({}, document.title, window.location.pathname);

            return {
                success: true,
                data: response.data,
            };

        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            
            return {
                success: false,
                error: error.message || 'OAuth callback failed',
            };
        }
    },

    // Logout
    logout: async () => {
        try {
            await supabase.auth.signOut();
            localStorage.removeItem('accessToken');
            localStorage.removeItem('supabaseToken');
            localStorage.removeItem('user');
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    },

    // Get current user
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('accessToken');
    },
    // Handle OAuth callback with pre-captured hash
    handleOAuthCallbackWithHash: async (hash) => {
        try {       
            if (!hash || hash === '#') {
                throw new Error('No hash data found - OAuth callback may have already been processed');
            }
            
            // Parse the hash parameters
            const hashParams = new URLSearchParams(hash.substring(1));
            
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');
            const expiresAt = hashParams.get('expires_at');
            const expiresIn = hashParams.get('expires_in');
            const providerToken = hashParams.get('provider_token');

            if (!accessToken || !refreshToken) {
                console.error('❌ Missing required tokens in URL hash');
                throw new Error('Missing access_token or refresh_token in callback');
            }

            // Manually set the session in Supabase
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            });

            if (sessionError) {
                console.error('❌ Error setting session:', sessionError);
                throw sessionError;
            }

            const response = await axios.post(`${API_URL}/auth/google`, {
                accessToken: accessToken,
            });

            // Store tokens and user data
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('supabaseToken', accessToken);

            // Clear the hash from URL (clean up)
            window.history.replaceState({}, document.title, window.location.pathname);

            return {
                success: true,
                data: response.data,
            };

        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
            
            return {
                success: false,
                error: error.message || 'OAuth callback failed',
            };
        }
    },
};


export default authService;