// src/services/auditLogService.js
// API service for audit logs (Vite version)

const API_BASE_URL = import.meta.env.VITE_AUDIT_API_URL || 'http://localhost:8080/api/audit';

/**
 * Get auth token from storage
 */
const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

/**
 * Log API calls in development mode
 */
const logApiCall = (method, url, params = {}) => {
  if (import.meta.env.VITE_LOG_API_CALLS === 'true') {
    console.log(`[API] ${method} ${url}`, params);
  }
};

/**
 * Fetch audit logs with filters
 */
export const fetchAuditLogs = async ({
  search = '',
  activity = 'All Activities',
  status = '',
  startDate = null,
  endDate = null,
  page = 0,
  size = 10
} = {}) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString()
  });

  if (search) params.append('search', search);
  if (activity && activity !== 'All Activities') {
    params.append('activity', activity);
  }
  if (status) params.append('status', status);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const url = `${API_BASE_URL}/logs?${params}`;
  logApiCall('GET', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized. Please log in as admin.');
    }
    throw new Error(`Failed to fetch audit logs: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch audit logs');
  }

  return {
    logs: data.data || [],
    currentPage: data.currentPage || 0,
    totalPages: data.totalPages || 1,
    totalItems: data.totalItems || 0
  };
};

/**
 * Get audit log statistics
 */
export const fetchAuditStats = async () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const url = `${API_BASE_URL}/stats`;
  logApiCall('GET', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch statistics');
  }

  const data = await response.json();
  return data.success ? data.data : null;
};

/**
 * Get available action types
 */
export const fetchAvailableActions = async () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const url = `${API_BASE_URL}/actions`;
  logApiCall('GET', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch actions');
  }

  const data = await response.json();
  return data.success ? data.data : [];
};

/**
 * Get audit history for specific entity
 */
export const fetchEntityAuditHistory = async (entityType, entityId) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const url = `${API_BASE_URL}/entity/${entityType}/${entityId}`;
  logApiCall('GET', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch entity history');
  }

  const data = await response.json();
  return data.success ? data.data : [];
};

/**
 * Export audit logs as CSV
 */
export const exportAuditLogsCSV = async ({
  search = '',
  activity = 'All Activities',
  status = '',
  startDate = null,
  endDate = null
} = {}) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (activity && activity !== 'All Activities') {
    params.append('activity', activity);
  }
  if (status) params.append('status', status);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const url = `${API_BASE_URL}/export/csv?${params}`;
  logApiCall('GET', url, { export: 'csv' });

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to export CSV');
  }

  // Download the file
  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  
  // Generate filename with current date
  const date = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `audit_logs_${date}.csv`);
  
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
};

/**
 * Manually create audit log (for testing or system actions)
 */
export const createAuditLog = async (action, description, userId = null, status = 'Success') => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const url = `${API_BASE_URL}/log`;
  const payload = { action, description, userId, status };
  logApiCall('POST', url, payload);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Failed to create audit log');
  }

  const data = await response.json();
  return data.success;
};

export default {
  fetchAuditLogs,
  fetchAuditStats,
  fetchAvailableActions,
  fetchEntityAuditHistory,
  exportAuditLogsCSV,
  createAuditLog
};