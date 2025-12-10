import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/ViewHistoryModal.css';

const ViewHistoryModal = ({ reportId, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [reportId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8080/api/reports/${reportId}/history`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      console.log('History data:', response.data);
      setHistory(response.data || []);
      setError(null);
    } catch (error) {
      console.error('❌ Failed to fetch history:', error);
      setError('Failed to load history');
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  // ✅ Use SVG icons instead of emojis
  const getChangeIcon = (action) => {
    const iconStyle = { width: '20px', height: '20px' };
    
    switch (action?.toUpperCase()) {
      case 'CREATED':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={iconStyle}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'UPDATED':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={iconStyle}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'STATUS_CHANGED':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={iconStyle}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'ASSIGNED':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={iconStyle}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'RESOLVED':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={iconStyle}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'REJECTED':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={iconStyle}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={iconStyle}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getActionColor = (action) => {
    switch (action?.toUpperCase()) {
      case 'CREATED': return '#28a745';
      case 'UPDATED': return '#007bff';
      case 'STATUS_CHANGED': return '#ffc107';
      case 'ASSIGNED': return '#17a2b8';
      case 'RESOLVED': return '#28a745';
      case 'REJECTED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  // ✅ Format field name to be more readable
  const formatFieldName = (fieldName) => {
    if (!fieldName) return '';
    
    const fieldNameMap = {
      'status': 'Status',
      'priority': 'Priority',
      'inspectorNotes': 'Inspector Notes',
      'adminNotes': 'Admin Notes',
      'estimatedCompletionDate': 'Estimated Completion Date'
    };
    
    return fieldNameMap[fieldName] || fieldName;
  };

  // ✅ Check if field is a long text field (notes)
  const isLongTextField = (fieldName) => {
    return fieldName === 'inspectorNotes' || fieldName === 'adminNotes';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Report History - {reportId}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading history...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
            </div>
          ) : history.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <p>No history available for this report</p>
            </div>
          ) : (
            <div className="history-timeline">
              {history.map((entry, index) => (
                <div 
                  key={index} 
                  className="history-entry"
                  style={{ '--entry-color': getActionColor(entry.action) }}
                >
                  <div 
                    className="entry-icon"
                    style={{ 
                      borderColor: getActionColor(entry.action),
                      color: getActionColor(entry.action)
                    }}
                  >
                    {getChangeIcon(entry.action)}
                  </div>
                  <div className="entry-content">
                    <div className="entry-header">
                      <span 
                        className="entry-action"
                        style={{ color: getActionColor(entry.action) }}
                      >
                        {entry.action}
                      </span>
                      <span className="entry-date">
                        {formatDate(entry.timestamp)}
                      </span>
                    </div>
                    <div className="entry-details">
                      <p className="entry-user">
                        <strong>By:</strong> {entry.updatedByName || `User #${entry.updatedBy}` || 'Unknown'}
                      </p>
                      
                      {entry.changeReason && (
                        <p className="entry-reason">
                          <strong>Reason:</strong> {entry.changeReason}
                        </p>
                      )}
                      
                      {/* ✅ Updated field change display with template literals */}
                      {entry.fieldName && (
                        <div className="entry-change">
                          <strong>Changed:</strong>
                          <div className="change-detail">
                            <span className="field-name">{formatFieldName(entry.fieldName)}</span>
                            
                            {/* ✅ Handle long text fields differently */}
                            {isLongTextField(entry.fieldName) ? (
                              <div style={{ marginTop: '8px' }}>
                                <div style={{ 
                                  padding: '10px', 
                                  background: '#fff3cd', 
                                  borderRadius: '6px',
                                  marginBottom: '8px',
                                  fontSize: '13px',
                                  border: '1px solid #ffc107',
                                  lineHeight: '1.5'
                                }}>
                                  <strong style={{ color: '#856404' }}>Previous:</strong>
                                  <div style={{ marginTop: '4px', color: '#333' }}>
                                    {entry.oldValue || '(empty)'}
                                  </div>
                                </div>
                                <div style={{ 
                                  padding: '10px', 
                                  background: '#d1e7dd', 
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  border: '1px solid #28a745',
                                  lineHeight: '1.5'
                                }}>
                                  <strong style={{ color: '#0f5132' }}>Updated to:</strong>
                                  <div style={{ marginTop: '4px', color: '#333' }}>
                                    {entry.newValue}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div style={{ marginTop: '4px' }}>
                                <span className="old-value">{`"${entry.oldValue || '(empty)'}"`}</span>
                                {' → '} 
                                <span className="new-value">{`"${entry.newValue}"`}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {entry.notes && (
                        <div className="entry-changes">
                          <strong>Changes:</strong>
                          <div className="change-detail">
                            {entry.notes}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ViewHistoryModal;