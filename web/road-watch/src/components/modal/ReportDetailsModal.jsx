import React, { useState, useEffect } from 'react';
import { XIcon, ImageIcon } from '../common/Icons';
import reportService from '../../services/api/reportService';
import '../modal/styles/ReportDetailsModal.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const ReportDetailsModal = ({ report, isOpen, onClose, onSave, mode = 'view' }) => {
  const [formData, setFormData] = useState({
    status: report?.status || 'Pending',
    adminNotes: ''
  });
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);

  useEffect(() => {
    if (report) {
      setFormData({
        status: report.status,
        adminNotes: report.adminNotes || ''
      });
      
      // Fetch images when modal opens
      fetchImages();
    }
  }, [report, mode]);

  const fetchImages = async () => {
    if (!report?.id) return;
    
    setLoadingImages(true);
    try {
      const response = await reportService.getReportImages(report.id);
      if (response.success) {
        console.log('✅ Fetched images:', response.data);
        setImages(response.data);
      }
    } catch (error) {
      console.error('❌ Failed to fetch images:', error);
    } finally {
      setLoadingImages(false);
    }
  };

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
    setImages([]); // Clear images when closing
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
            <label className="modal-label">Photos ({images.length})</label>
            {loadingImages ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                Loading images...
              </div>
            ) : images.length > 0 ? (
              <div className="report-photos-grid">
                {images.map((image) => (
                  <div key={image.id} style={{ 
                    width: '150px', 
                    height: '150px', 
                    border: '1px solid #ddd', 
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={`${API_URL}${image.imageUrl}`} 
                      alt={`Report ${report.id} - Image ${image.id}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        console.error('Failed to load image:', image.imageUrl);
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect fill="%23f0f0f0" width="150" height="150"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="14">Image not found</text></svg>';
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                padding: '40px', 
                textAlign: 'center', 
                background: '#f9f9f9', 
                borderRadius: '8px',
                color: '#999'
              }}>
                <ImageIcon />
                <p style={{ marginTop: '10px' }}>No photos uploaded</p>
              </div>
            )}
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
          ) : (
            <div className="modal-actions-right" style={{ marginLeft: 'auto' }}>
              <button className="modal-btn close-btn" onClick={handleClose}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsModal;