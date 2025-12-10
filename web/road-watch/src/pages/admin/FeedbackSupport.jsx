import React, { useState, useEffect } from 'react';
import FeedbackStats from '../../components/feedback/FeedbackStats';
import CitizenFeedbackSection from '../../components/feedback/CitizenFeedbackSection';
import FeedbackDetailsModal from '../../components/modal/FeedbackDetailsModal';
import feedbackService from '../../services/api/feedbackService';
import '../admin/styles/FeedbackSupport.css';

const FeedbackSupport = () => {
  // Feedback states
  const [feedbackSearchQuery, setFeedbackSearchQuery] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState('All Status');
  const [feedbackCategory, setFeedbackCategory] = useState('All Categories');
  const [feedbackRowsPerPage, setFeedbackRowsPerPage] = useState(10);
  
  // Data states
  const [feedbackData, setFeedbackData] = useState([]);
  const [stats, setStats] = useState({
    totalFeedback: 0,
    pendingReview: 0,
    resolved: 0,
    avgResponseTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view' or 'edit'

  // Fetch feedback data on component mount
  useEffect(() => {
    console.log('🔄 FeedbackSupport component mounted, fetching data...');
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    console.log('📡 Fetching all feedback data...');
    setLoading(true);
    setError(null);

    try {
      // Fetch feedback list
      console.log('📥 Fetching feedback list...');
      const feedbackResponse = await feedbackService.getAllFeedback();
      
      if (feedbackResponse.success) {
        console.log('✅ Feedback data received:', feedbackResponse.data);
        
        // Format feedback data
        const formattedFeedback = feedbackResponse.data.map(fb => ({
          id: `FB-${fb.id}`,
          submittedBy: fb.submittedBy?.name || fb.submittedBy?.email || 'Unknown User',
          category: fb.category,
          dateSubmitted: new Date(fb.dateSubmitted).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }),
          status: fb.status,
          rawData: fb // Keep original data for detail view
        }));
        
        setFeedbackData(formattedFeedback);
        console.log('✅ Formatted feedback data:', formattedFeedback);
      } else {
        console.error('❌ Failed to fetch feedback:', feedbackResponse.error);
        setError('Failed to load feedback data');
      }

      // Fetch stats
      console.log('📊 Fetching feedback stats...');
      const statsResponse = await feedbackService.getFeedbackStats();
      
      if (statsResponse.success) {
        console.log('✅ Stats data received:', statsResponse.data);
        setStats({
          totalFeedback: statsResponse.data.totalFeedback || 0,
          pendingReview: statsResponse.data.pendingReview || 0,
          resolved: statsResponse.data.resolved || 0,
          avgResponseTime: calculateAvgResponseTime(feedbackResponse.data) // Calculate from data
        });
      } else {
        console.error('❌ Failed to fetch stats:', statsResponse.error);
      }

    } catch (err) {
      console.error('❌ Error fetching data:', err);
      setError('An error occurred while loading data');
    } finally {
      setLoading(false);
      console.log('🏁 Data fetching completed');
    }
  };

  // Calculate average response time in hours
  const calculateAvgResponseTime = (feedbacks) => {
    if (!feedbacks || feedbacks.length === 0) return 0;
    
    const respondedFeedbacks = feedbacks.filter(fb => 
      fb.respondedAt && fb.dateSubmitted
    );
    
    if (respondedFeedbacks.length === 0) return 0;
    
    const totalHours = respondedFeedbacks.reduce((sum, fb) => {
      const submitted = new Date(fb.dateSubmitted);
      const responded = new Date(fb.respondedAt);
      const hours = (responded - submitted) / (1000 * 60 * 60);
      return sum + hours;
    }, 0);
    
    return Math.round(totalHours / respondedFeedbacks.length);
  };

  const handleFeedbackView = (id) => {
    console.log('👁️ View feedback clicked:', id);
    const feedback = feedbackData.find(fb => fb.id === id);
    if (feedback) {
      console.log('📋 Feedback details:', feedback.rawData);
      setSelectedFeedback(feedback.rawData);
      setModalMode('view');
      setIsModalOpen(true);
    }
  };

  const handleFeedbackEdit = (id) => {
    console.log('✏️ Edit feedback clicked:', id);
    const feedback = feedbackData.find(fb => fb.id === id);
    if (feedback) {
      console.log('📋 Editing feedback:', feedback.rawData);
      setSelectedFeedback(feedback.rawData);
      setModalMode('edit');
      setIsModalOpen(true);
    }
  };

  const handleFeedbackSave = async (updatedFeedback) => {
    console.log('💾 Saving feedback:', updatedFeedback);
    
    try {
      const feedbackId = updatedFeedback.id;
      const updates = {
        status: updatedFeedback.status,
        adminResponse: updatedFeedback.adminResponse,
        respondedById: parseInt(localStorage.getItem('userId')) // Admin ID from JWT
      };

      const response = await feedbackService.updateFeedbackStatus(feedbackId, updates);
      
      if (response.success) {
        console.log('✅ Feedback updated successfully');
        // Refresh data
        await fetchAllData();
        setIsModalOpen(false);
        setSelectedFeedback(null);
      } else {
        console.error('❌ Failed to update feedback:', response.error);
        alert('Failed to update feedback');
      }
    } catch (error) {
      console.error('❌ Error updating feedback:', error);
      alert('An error occurred while updating feedback');
    }
  };

  const handleModalClose = () => {
    console.log('🚪 Closing modal');
    setIsModalOpen(false);
    setSelectedFeedback(null);
    setModalMode('view');
  };

  const handleFeedbackDateRange = () => {
    console.log('📅 Open feedback date range filter');
    // TODO: Implement date range filter
  };

  const handleRefresh = () => {
    console.log('🔄 Refresh button clicked');
    fetchAllData();
  };

  if (loading) {
    return (
      <div className="feedback-support-container">
        <div style={{ 
          padding: '40px', 
          textAlign: 'center',
          fontSize: '16px',
          color: '#666'
        }}>
          <div className="spinner" style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #005F56',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          Loading feedback data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feedback-support-container">
        <div style={{ 
          padding: '40px', 
          textAlign: 'center',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          color: '#c33'
        }}>
          <p style={{ marginBottom: '16px' }}>⚠️ {error}</p>
          <button 
            onClick={handleRefresh}
            style={{
              padding: '10px 20px',
              backgroundColor: '#005F56',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-support-container">
    
      <FeedbackStats stats={stats} />

      <CitizenFeedbackSection
        feedbackData={feedbackData}
        searchQuery={feedbackSearchQuery}
        onSearchChange={setFeedbackSearchQuery}
        selectedStatus={feedbackStatus}
        onStatusChange={setFeedbackStatus}
        selectedCategory={feedbackCategory}
        onCategoryChange={setFeedbackCategory}
        onDateRange={handleFeedbackDateRange}
        onView={handleFeedbackView}
        onEdit={handleFeedbackEdit}
        rowsPerPage={feedbackRowsPerPage}
        onRowsPerPageChange={setFeedbackRowsPerPage}
      />

      {/* Feedback Details/Edit Modal */}
      {selectedFeedback && (
        <FeedbackDetailsModal
          feedback={selectedFeedback}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={handleFeedbackSave}
          mode={modalMode}
        />
      )}
    </div>
  );
};

export default FeedbackSupport;