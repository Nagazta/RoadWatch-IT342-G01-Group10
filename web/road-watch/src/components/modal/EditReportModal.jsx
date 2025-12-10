import React, { useState } from 'react';
import './styles/EditReportModal.css';

const EditReportModal = ({ report, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    status: report.status || 'Pending',
    inspectorNotes: report.inspectorNotes || '',
    estimatedCompletionDate: report.estimatedCompletionDate || '',
    priority: report.priority || 'Medium',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Include change reason for audit trail
      const updateData = {
        ...formData,
        updatedBy: localStorage.getItem('adminId'), // Inspector ID
        updatedAt: new Date().toISOString(),
        changeReason: formData.changeReason || 'Inspector update'
      };

      await onSave(report.id, updateData);
      onClose();
    } catch (error) {
      console.error('Failed to update report:', error);
      alert('Failed to update report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Report - {report.id}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Report Info (Read-only) */}
            <div className="form-section">
              <h3>Report Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Title:</label>
                  <span>{report.title}</span>
                </div>
                <div className="info-item">
                  <label>Category:</label>
                  <span>{report.category}</span>
                </div>
                <div className="info-item">
                  <label>Submitted By:</label>
                  <span>{report.submittedBy}</span>
                </div>
                <div className="info-item">
                  <label>Date Submitted:</label>
                  <span>{report.dateSubmitted}</span>
                </div>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="form-section">
              <h3>Update Report</h3>
              
              <div className="form-group">
                <label htmlFor="status">Status *</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="In-Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="estimatedCompletionDate">Estimated Completion Date</label>
                <input
                  type="date"
                  id="estimatedCompletionDate"
                  name="estimatedCompletionDate"
                  value={formData.estimatedCompletionDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="inspectorNotes">Inspector Notes</label>
                <textarea
                  id="inspectorNotes"
                  name="inspectorNotes"
                  value={formData.inspectorNotes}
                  onChange={handleChange}
                  placeholder="Add notes about the inspection or work progress..."
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="changeReason">Reason for Change *</label>
                <input
                  type="text"
                  id="changeReason"
                  name="changeReason"
                  value={formData.changeReason || ''}
                  onChange={handleChange}
                  placeholder="e.g., Site inspection completed, Status update after repair"
                  required
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReportModal;