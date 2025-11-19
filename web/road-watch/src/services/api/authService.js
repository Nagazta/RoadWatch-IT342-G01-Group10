import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const supabaseUrl = 'https://jskbdkxzjogtmrzjxmns.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impza2Jka3h6am9ndG1yemp4bW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMDY2NzQsImV4cCI6MjA3NzU4MjY3NH0.RhWHR0FsTvo3bKAh9HToX09KfEJzJTs-cnMPrnaFYXQ'

if (!supabaseUrl || !supabaseAnonKey) { 
    alert('Configuration Error: Missing Supabase keys. Check console for details.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


const authService = {
    // 1. REGISTER
    register: async (userData) => {
        try {
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
                // 🔍 DETECT DUPLICATE EMAIL HERE
                if (authError.message.includes('already registered') || authError.status === 422) {
                    throw new Error('This email address is already in use. Please log in instead.');
                }
                throw authError;
            }

            // Sync with Backend (Fail-safe)
            try {
                await axios.post(`${API_URL}/users/add`, {
                    username: userData.username,
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    role: 'CITIZEN',
                    contact: userData.contact || '',
                });
            } catch (backendError) {
                console.warn('⚠️ Backend sync failed, but Supabase Auth worked.');
            }

            return { success: true, data: authData };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // 2. LOGIN
    login: async (email, password) => {
        try {
            const { data: supabaseData, error: supabaseError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (supabaseError) throw supabaseError;

            // Backend Login Sync
            try {
                const response = await axios.post(`${API_URL}/auth/login`, { email, password });
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            } catch (e) {
                console.warn('⚠️ Backend login failed. Using Supabase session only.');
            }

            localStorage.setItem('supabaseToken', supabaseData.session.access_token);
            return { success: true, data: supabaseData };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // 3. GOOGLE LOGIN
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
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // 4. HANDLE OAUTH CALLBACK (The function your Page needs!)
    handleOAuthCallbackWithHash: async (hash) => {
        try {
            if (!hash || hash === '#') throw new Error('No hash data found');

            // Parse tokens from the hash string
            const hashParams = new URLSearchParams(hash.substring(1));
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');

            if (!accessToken || !refreshToken) throw new Error('Missing tokens in URL');

            // Manually set the Supabase session
            const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            });

            if (error) throw error;

            // Sync Google User to Backend
            try {
                const response = await axios.post(`${API_URL}/auth/google`, { accessToken });
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            } catch (err) {
                console.warn('⚠️ Backend Google sync failed');
            }

            localStorage.setItem('supabaseToken', accessToken);
            return { success: true, data };

        } catch (error) {
            console.error('OAuth Error:', error);
            return { success: false, error: error.message };
        }
    },

    // 5. LOGOUT
    logout: async () => {
        await supabase.auth.signOut();
        localStorage.clear();
        return { success: true };
    }
};


export default authService;