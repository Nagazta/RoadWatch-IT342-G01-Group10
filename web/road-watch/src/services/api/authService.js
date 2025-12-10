// Complete authService.js for RoadWatch - FIXED FOR PRODUCTION
// Location: src/services/api/authService.js

import { supabase } from '../../config/supabaseClient.js';
import axios from "axios";

// ✅ FIXED: Use VITE_API_BASE_URL to match Dockerfile
const API_URL = import.meta.env.VITE_API_BASE_URL;

// Validate environment variable
if (!API_URL) {
    console.error('❌ VITE_API_BASE_URL is not set!');
    throw new Error('API URL configuration is missing. Please set VITE_API_BASE_URL environment variable.');
}

console.log('🔗 API URL configured:', API_URL);

const authService = {
    /**
     * CITIZEN REGISTRATION - Manual signup
     */
    async register(userData) {
        try {
            console.log('🔐 Registration attempt:', userData.email);
            
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            console.log('📥 Register response:', data);

            if (data.success && data.accessToken) {
                // Store JWT token and user data
                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('roleData', JSON.stringify(data.roleData));
                localStorage.setItem('userRole', data.user.role);
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('adminId', data.user.id);
                
                console.log('✅ Registration successful');
            }

            return data;
        } catch (error) {
            console.error('❌ Registration error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * GENERAL LOGIN - Email + Password (for Citizens/Admins/Inspectors)
     */
    async login(email, password) {
        try {
            console.log('🔐 Login attempt:', email);
            
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            console.log('📡 Response status:', response.status);
            const data = await response.json();
            console.log('📥 Login response:', data);

            if (data.success && data.accessToken) {
                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('roleData', JSON.stringify(data.roleData));
                localStorage.setItem('userRole', data.user.role);
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('adminId', data.user.id);
                
                console.log('✅ Login successful');
                console.log('User role:', data.user.role);
                console.log('User ID:', data.user.id);

                // Return data in expected format for your frontend
                return {
                    success: true,
                    data: {
                        token: data.accessToken,
                        user: {
                            id: data.user.id,
                            email: data.user.email,
                            name: data.user.name,
                            role: data.user.role
                        },
                        roleData: data.roleData
                    }
                };
            }

            return { success: false, error: data.message || 'Login failed' };
        } catch (error) {
            console.error('❌ Login error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * INSPECTOR LOGIN - Email + Password (No Supabase)
     */
    async loginInspector(email, password) {
        try {
            console.log('🔐 Inspector login attempt:', email);
            
            const response = await fetch(`${API_URL}/api/auth/login-inspector`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            console.log('📡 Inspector login response status:', response.status);
            const data = await response.json();
            console.log('📥 Inspector login response:', data);

            if (data.success && data.accessToken) {
                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('roleData', JSON.stringify(data.roleData));
                localStorage.setItem('userRole', data.user.role);
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('adminId', data.user.id);
                
                console.log('✅ Inspector login successful');
                console.log('Inspector ID:', data.roleData?.inspector_id);
                console.log('Area:', data.roleData?.area_assignment);

                // Return in same format as regular login
                return {
                    success: true,
                    data: {
                        token: data.accessToken,
                        user: {
                            id: data.user.id,
                            email: data.user.email,
                            name: data.user.name,
                            role: data.user.role
                        },
                        roleData: data.roleData
                    }
                };
            }

            return { success: false, error: data.message || 'Inspector login failed' };
        } catch (error) {
            console.error('❌ Inspector login error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * GOOGLE OAUTH LOGIN - Citizens only
     */
    async loginWithGoogle() {
        try {
            console.log('🔐 Starting Google OAuth flow...');
            
            // Step 1: Initiate Google OAuth with Supabase
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    }
                }
            });

            if (error) {
                console.error('❌ Supabase OAuth error:', error);
                return { success: false, error: error.message };
            }

            console.log('✅ Google OAuth redirect initiated');
            // OAuth will redirect, so we return pending state
            return { success: true, pending: true };
        } catch (error) {
            console.error('❌ Google login error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Handle OAuth callback after Google redirect
     * Call this in your /auth/callback route
     */
    async handleOAuthCallback() {
        try {
            console.log('🔄 Handling OAuth callback...');
            
            // Step 1: Get Supabase session
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error || !session) {
                console.error('❌ No session found:', error);
                return { success: false, error: 'Authentication failed' };
            }

            console.log('✅ Supabase session obtained');
            console.log('📧 User email:', session.user.email);

            // Step 2: Send Supabase access token to YOUR backend
            const response = await fetch(`${API_URL}/api/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    accessToken: session.access_token 
                }),
            });

            console.log('📡 Backend response status:', response.status);
            const data = await response.json();
            console.log('📥 Backend response:', data);

            if (data.success && data.accessToken) {
                // Store YOUR JWT token (not Supabase token)
                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('roleData', JSON.stringify(data.roleData));
                localStorage.setItem('userRole', data.user.role);
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('adminId', data.user.id);
                
                console.log('✅ Google OAuth login successful');
                console.log('Citizen ID:', data.roleData?.citizen_id);
                console.log('Google ID:', data.roleData?.google_id);

                // Return data in expected format
                return {
                    success: true,
                    data: {
                        token: data.accessToken,
                        user: {
                            id: data.user.id,
                            email: data.user.email,
                            name: data.user.name,
                            role: data.user.role
                        },
                        roleData: data.roleData
                    }
                };
            }

            return { success: false, error: data.message || 'Login failed' };
        } catch (error) {
            console.error('❌ OAuth callback error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * ADMIN - Create Inspector Account
     */
    async createInspector(inspectorData, adminId) {
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${API_URL}/api/users/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: inspectorData.email,
                    username: inspectorData.username,
                    name: inspectorData.name,
                    password: inspectorData.password,
                    contact: inspectorData.contact,
                    role: 'INSPECTOR',
                    assignedArea: inspectorData.assignedArea,
                    createdByAdminId: adminId,
                }),
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('❌ Create inspector error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Get current user profile
     */
    async getProfile() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return { success: false, error: 'No token found' };

            const response = await fetch(`${API_URL}/api/auth/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('❌ Get profile error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Logout
     */
    async logout() {
        try {
            const token = localStorage.getItem('token');
            
            await fetch(`${API_URL}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            // Clear Supabase session too
            await supabase.auth.signOut();

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('roleData');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userId');
            localStorage.removeItem('adminId');
            
            console.log('✅ Logged out successfully');
            return { success: true };
        } catch (error) {
            console.error('❌ Logout error:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Get stored user data
     */
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Get stored role data (for inspectors/citizens/admins)
     */
    getRoleData() {
        const roleDataStr = localStorage.getItem('roleData');
        return roleDataStr ? JSON.parse(roleDataStr) : null;
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    /**
     * Update citizen profile
     */
    updateCitizen: async (id, updatedUser) => {
        try {
            console.log('📝 Updating citizen profile:', id);
            
            const response = await axios.put(
                `${API_URL}/api/users/profile?userId=${id}`, 
                updatedUser
            );

            console.log('✅ Profile updated:', response.data);
            
            if (response.data) {
                return { success: true, data: response.data };
            } else {
                throw new Error('Failed to update citizen profile');
            }
        } catch (error) {
            console.error('❌ Update profile error:', error);
            return { success: false, error: error.message };
        }
    }
};

export default authService;