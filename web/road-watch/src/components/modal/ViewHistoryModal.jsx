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
      
      console.log('📜 History data:', response.data);
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

  const getChangeIcon = (action) => {
    switch (action?.toUpperCase()) {
      case 'CREATED': return '📝';
      case 'UPDATED': return '✏️';
      case 'STATUS_CHANGED': return '🔄';
      case 'ASSIGNED': return '👤';
      case 'RESOLVED': return '✅';
      case 'REJECTED': return '❌';
      default: return '📌';
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📋 Report History - {reportId}</h2>
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
                    style={{ borderColor: getActionColor(entry.action) }}
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
                      
                      {entry.fieldName && (
                        <div className="entry-change">
                          <strong>Changed:</strong>
                          <div className="change-detail">
                            <span className="field-name">{entry.fieldName}:</span>
                            {' '}
                            <span className="old-value">"{entry.oldValue || 'empty'}"</span>
                            {' → '}
                            <span className="new-value">"{entry.newValue}"</span>
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