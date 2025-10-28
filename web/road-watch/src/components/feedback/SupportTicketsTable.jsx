// src/components/feedback/SupportTicketsTable.jsx
import React from 'react';
import SupportTicketsTableHeader from './SupportTicketsTableHeader';
import SupportTicketTableRow from './SupportTicketTableRow';
import '../reports/styles/ReportsTable.css';

const SupportTicketsTable = ({ supportTickets }) => {
  return (
    <div className="table-container">
      <table className="reports-table">
        <SupportTicketsTableHeader />
        <tbody>
          {supportTickets.map((ticket, index) => (
            <SupportTicketTableRow
              key={`${ticket.id}-${index}`}
              ticket={ticket}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupportTicketsTable;