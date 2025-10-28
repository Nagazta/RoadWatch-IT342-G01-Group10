import React from 'react';
import TicketPriorityFilter from './TicketPriorityFilter';
import TicketStatusFilter from './TicketStatusFilter';
import TicketDateFilter from './TicketDateFilter';
import SupportTicketsTable from './SupportTicketsTable';
import '../feedback/styles/SupportTicketsSection.css';

const SupportTicketsSection = ({
  supportTickets,
  selectedPriority,
  onPriorityChange,
  selectedStatus,
  onStatusChange,
  selectedDateCreated,
  onDateCreatedChange
}) => {
  return (
    <div className="support-tickets-section">
      <h2 className="section-title">Support Tickets</h2>

      <div className="ticket-filters">
        <TicketPriorityFilter
          value={selectedPriority}
          onChange={onPriorityChange}
        />
        <TicketStatusFilter
          value={selectedStatus}
          onChange={onStatusChange}
        />
        <TicketDateFilter
          value={selectedDateCreated}
          onChange={onDateCreatedChange}
        />
      </div>

      <SupportTicketsTable supportTickets={supportTickets} />

      <div className="tickets-footer">
        <span className="tickets-count">Showing 1 to 4 of 4 tickets</span>
        <div className="tickets-pagination">
          <span className="tickets-page-info">Page 1 of 1</span>
          <div className="pagination-controls">
            <button className="pagination-btn" disabled>Previous</button>
            <button className="pagination-btn" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketsSection;