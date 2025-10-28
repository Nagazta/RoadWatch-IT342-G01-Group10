import React, { useState } from 'react';
import FeedbackStats from '../../components/feedback/FeedbackStats';
import CitizenFeedbackSection from '../../components/feedback/CitizenFeedbackSection';
import SupportTicketsSection from '../../components/feedback/SupportTicketsSection';
import '../admin/styles/FeedbackSupport.css';

const FeedbackSupport = () => {
  const [feedbackSearchQuery, setFeedbackSearchQuery] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState('All Status');
  const [feedbackCategory, setFeedbackCategory] = useState('All Categories');
  const [feedbackRowsPerPage, setFeedbackRowsPerPage] = useState(10);

  const [ticketPriority, setTicketPriority] = useState('All Priorities');
  const [ticketStatus, setTicketStatus] = useState('All Status');
  const [ticketDateCreated, setTicketDateCreated] = useState('Date Created');

  // Mock stats data
  const stats = {
    totalFeedback: 6,
    pendingReview: 2,
    resolved: 3,
    avgResponseTime: 6
  };

  // Mock feedback data
  const feedbackData = [
    { id: 'FB-101', submittedBy: 'Juan Dela Cruz', category: 'Bug', dateSubmitted: '2025-10-20', status: 'Pending' },
    { id: 'FB-102', submittedBy: 'Maria Santos', category: 'Suggestion', dateSubmitted: '2025-10-19', status: 'Resolved' },
    { id: 'FB-103', submittedBy: 'Jose Ramos', category: 'Inquiry', dateSubmitted: '2025-10-18', status: 'In Progress' },
    { id: 'FB-104', submittedBy: 'Ana Garcia', category: 'Bug', dateSubmitted: '2025-10-17', status: 'Resolved' },
    { id: 'FB-105', submittedBy: 'Carlos Reyes', category: 'Suggestion', dateSubmitted: '2025-10-16', status: 'Pending' },
    { id: 'FB-106', submittedBy: 'Linda Tan', category: 'Inquiry', dateSubmitted: '2025-10-15', status: 'Resolved' }
  ];

  // Mock support tickets data
  const supportTickets = [
    { id: 'TK-201', issueType: 'API Error - Report Submission Endpoint', priority: 'High', status: 'Open', assignedTo: 'IT Team', dateCreated: '2025-10-21' },
    { id: 'TK-202', issueType: 'Database Backup Failed', priority: 'Medium', status: 'Resolved', assignedTo: 'DB Admin', dateCreated: '2025-10-20' },
    { id: 'TK-203', issueType: 'Email Notification System Down', priority: 'High', status: 'In Progress', assignedTo: 'IT Team', dateCreated: '2025-10-20' },
    { id: 'TK-204', issueType: 'User Permission Update Request', priority: 'Low', status: 'Open', assignedTo: 'Admin Team', dateCreated: '2025-10-19' }
  ];

  const handleFeedbackView = (id) => {
    console.log('View feedback:', id);
  };

  const handleFeedbackDateRange = () => {
    console.log('Open feedback date range');
  };

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
        rowsPerPage={feedbackRowsPerPage}
        onRowsPerPageChange={setFeedbackRowsPerPage}
      />

      <SupportTicketsSection
        supportTickets={supportTickets}
        selectedPriority={ticketPriority}
        onPriorityChange={setTicketPriority}
        selectedStatus={ticketStatus}
        onStatusChange={setTicketStatus}
        selectedDateCreated={ticketDateCreated}
        onDateCreatedChange={setTicketDateCreated}
      />
    </div>
  );
};

export default FeedbackSupport;