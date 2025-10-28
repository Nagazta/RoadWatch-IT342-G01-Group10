import React from 'react';
import '../feedback/styles/FeedbackCategoryBadge.css';

const FeedbackCategoryBadge = ({ category }) => {
  const getCategoryClass = (category) => {
    switch (category) {
      case 'Bug':
        return 'category-bug';
      case 'Suggestion':
        return 'category-suggestion';
      case 'Inquiry':
        return 'category-inquiry';
      case 'Complaint':
        return 'category-complaint';
      default:
        return 'category-other';
    }
  };

  return (
    <span className={`feedback-category-badge ${getCategoryClass(category)}`}>
      {category}
    </span>
  );
};

export default FeedbackCategoryBadge;