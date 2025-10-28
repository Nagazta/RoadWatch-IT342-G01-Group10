// src/components/feedback/SupportTicketTableRow.jsx
import React from 'react';
import TicketPriorityBadge from './TicketPriorityBadge';
import TicketStatusBadge from './TicketStatusBadge';
import '../reports/styles/TableRow.css';

const SupportTicketTableRow = ({ ticket }) => {
  return (
    <tr className="table-row">
      <td className="report-id">{ticket.id}</td>
      <td className="report-title">{ticket.issueType}</td>
      <td>
        <TicketPriorityBadge priority={ticket.priority} />
      </td>
      <td>
        <TicketStatusBadge status={ticket.status} />
      </td>
      <td>{ticket.assignedTo}</td>
      <td>{ticket.dateCreated}</td>
    </tr>
  );
};

export default SupportTicketTableRow;