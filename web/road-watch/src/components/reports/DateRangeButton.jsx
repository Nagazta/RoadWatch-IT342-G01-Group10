import React from 'react';
import { CalendarIcon } from '../common/Icons';
import '../reports/styles/DateRangeButton.css';

const DateRangeButton = ({ onClick }) => {
  return (
    <button className="date-range-btn" onClick={onClick}>
      <CalendarIcon />
      <span>Date Range</span>
    </button>
  );
};

export default DateRangeButton;