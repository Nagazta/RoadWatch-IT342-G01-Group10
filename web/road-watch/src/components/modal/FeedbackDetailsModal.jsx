import React, { useState, useEffect } from 'react';
import { XIcon } from '../common/Icons';
import '../modal/styles/ReportDetailsModal.css'; // Reuse the same styles

const FeedbackDetailsModal = ({ feedback, isOpen, onClose, onSave, mode = 'view' }) => {
  const [formData, setFormData] = useState({
    status: feedback?.status || 'Pending',
    adminResponse: feedback?.adminResponse || ''
  });

  useEffect(() => {
    if (feedback) {
      setFormData({
        status: feedback.status || 'Pending',
        adminResponse: feedback.adminResponse || ''
      });
    }
  }, [feedback, mode]);

  if (!isOpen || !feedback) return null;

  const isEditing = mode === 'edit';

  const handleStatusChange = (e) => {
    setFormData(prev => ({ ...prev, status: e.target.value }));
  };

  const handleResponseChange = (e) => {
    setFormData(prev => ({ ...prev, adminResponse: e.target.value }));
  };

  const handleSaveChanges = () => {
    onSave({ ...feedback, ...formData });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content report-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? `Edit Feedback - FB-${feedback.id}` : `Feedback Details - FB-${feedback.id}`}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body report-modal-body">
          {/* Feedback ID and Date Submitted */}
          <div className="modal-grid-2">
            <div className="modal-field">
              <label className="modal-label">Feedback ID</label>
              <div className="modal-value-box">FB-{feedback.id}</div>
            </div>
            <div className="modal-field">
              <label className="modal-label">Date Submitted</label>
              <div className="modal-value-box">
                {new Date(feedback.dateSubmitted).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>

          {/* Category and Submitted By */}
          <div className="modal-grid-2">
            <div className="modal-field">
              <label className="modal-label">Category</label>
              <div className="modal-value-box">{feedback.category}</div>
            </div>
            <div className="modal-field">
              <label className="modal-label">Submitted By</label>
              <div className="modal-value-box">
                {feedback.submittedBy?.name || feedback.submittedBy?.email || 'Unknown User'}
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="modal-field">
            <label className="modal-label">Contact Email</label>
            <div className="modal-value-box">{feedback.email}</div>
          </div>

          {/* Subject */}
          <div className="modal-field">
            <label className="modal-label">Subject</label>
            <div className="modal-value-box">{feedback.subject}</div>
          </div>

          {/* Message */}
          <div className="modal-field">
            <label className="modal-label">Message</label>
            <div className="modal-value-box report-description">{feedback.message}</div>
          </div>

          {/* Divider */}
          <div className="modal-divider"></div>

          {/* Status */}
          <div className="modal-field">
            <label className="modal-label">
              Status {isEditing && <span className="required-asterisk">*</span>}
            </label>
            {isEditing ? (
              <select 
                className="modal-select"
                value={formData.status}
                onChange={handleStatusChange}
              >
                <option value="Pending">Pending</option>
                <option value="In-Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            ) : (
              <div className="modal-value-box">{feedback.status}</div>
            )}
          </div>

          {/* Admin Response */}
          <div className="modal-field">
            <label className="modal-label">Admin Response</label>
            {isEditing ? (
              <textarea
                className="modal-textarea"
                placeholder="Type your response to the user's feedback..."
                value={formData.adminResponse}
                onChange={handleResponseChange}
                rows={6}
              />
            ) : (
              <div className="modal-value-box report-notes">
                {feedback.adminResponse || 'No response added yet.'}
              </div>
            )}
          </div>

          {/* Response Info */}
          {feedback.respondedAt && (
            <div className="modal-grid-2">
              <div className="modal-field">
                <label className="modal-label">Responded At</label>
                <div className="modal-value-box">
                  {new Date(feedback.respondedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="modal-field">
                <label className="modal-label">Responded By</label>
                <div className="modal-value-box">
                  {feedback.respondedBy?.name || feedback.respondedBy?.email || 'Admin'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          {isEditing ? (
            <div className="modal-actions-right" style={{ marginLeft: 'auto' }}>
              <button className="modal-btn close-btn" onClick={onClose}>
                Cancel
              </button>
              <button className="modal-btn save-btn" onClick={handleSaveChanges}>
                Save Response
              </button>
            </div>
          ) : (
            <div className="modal-actions-right" style={{ marginLeft: 'auto' }}>
              <button className="modal-btn close-btn" onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetailsModal;