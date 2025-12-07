import React, { useState, useEffect } from 'react';
import { XIcon, ImageIcon } from '../common/Icons';
import '../modal/styles/ReportDetailsModal.css';

const ReportDetailsModal = ({ report, isOpen, onClose, onSave, mode = 'view' }) => {
  const [formData, setFormData] = useState({
    status: report?.status || 'Pending',
    adminNotes: ''
  });

  useEffect(() => {
    if (report) {
      setFormData({
        status: report.status,
        adminNotes: report.adminNotes || ''
      });
    }
  }, [report, mode]);

  if (!isOpen || !report) return null;

  const isEditing = mode === 'edit';

  const handleStatusChange = (e) => {
    setFormData(prev => ({ ...prev, status: e.target.value }));
  };

  const handleNotesChange = (e) => {
    setFormData(prev => ({ ...prev, adminNotes: e.target.value }));
  };

  const handleSaveChanges = () => {
    onSave({ ...report, ...formData });
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content report-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? `Report ID` : `Report Details - ${report.id}`}
          </h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <XIcon />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body report-modal-body">
          {/* Report ID and Date Submitted */}
          <div className="modal-grid-2">
            <div className="modal-field">
              <label className="modal-label">Report ID</label>
              <div className="modal-value-box">{report.id}</div>
            </div>
            <div className="modal-field">
              <label className="modal-label">Date Submitted</label>
              <div className="modal-value-box">{report.dateSubmitted}</div>
            </div>
          </div>

          {/* Title */}
          <div className="modal-field">
            <label className="modal-label">Title</label>
            <div className="modal-value-box">{report.title}</div>
          </div>

          {/* Description */}
          <div className="modal-field">
            <label className="modal-label">Description</label>
            <div className="modal-value-box report-description">{report.description}</div>
          </div>

          {/* Category and Submitted By */}
          <div className="modal-grid-2">
            <div className="modal-field">
              <label className="modal-label">Category</label>
              <div className="modal-value-box">{report.category}</div>
            </div>
            <div className="modal-field">
              <label className="modal-label">Submitted By</label>
              <div className="modal-value-box">{report.submittedBy}</div>
            </div>
          </div>

          {/* Location */}
          <div className="modal-field">
            <label className="modal-label">Location</label>
            <div className="modal-value-box">{report.location}</div>
          </div>

          {/* Photos */}
          <div className="modal-field">
            <label className="modal-label">Photos</label>
            <div className="report-photos-grid">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="report-photo-placeholder">
                  <ImageIcon />
                </div>
              ))}
            </div>
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
                <option value="In-Progress">In-Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            ) : (
              <div className="modal-value-box">{report.status}</div>
            )}
          </div>

          {/* Admin Notes */}
          <div className="modal-field">
            <label className="modal-label">Admin Notes</label>
            {isEditing ? (
              <textarea
                className="modal-textarea"
                placeholder="Add remarks or notes about this report..."
                value={formData.adminNotes}
                onChange={handleNotesChange}
                rows={4}
              />
            ) : (
              <div className="modal-value-box report-notes">
                {report.adminNotes || 'No notes added yet.'}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          {isEditing ? (
            <div className="modal-actions-right" style={{ marginLeft: 'auto' }}>
              <button className="modal-btn close-btn" onClick={handleClose}>
                Close
              </button>
              <button className="modal-btn save-btn" onClick={handleSaveChanges}>
                Save Changes
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsModal;