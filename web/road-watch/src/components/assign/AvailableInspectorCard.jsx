import React from 'react';
import { CheckCircleIcon } from '../common/Icons';
import '../assign/styles/AvailableInspectorsCard.css';

const AvailableInspectorCard = ({ inspector }) => {
    // Safety check: ensure count exists, default to 0 if undefined
    const count = inspector.activeAssignments || 0;

    return (
        <div className="available-inspector-card">
            <div className="available-inspector-icon">
                <CheckCircleIcon />
            </div>
            <div className="available-inspector-info">
                <h3 className="available-inspector-name">{inspector.name}</h3>

                {/* ⬇️ FIX: Use the variable 'count' instead of hardcoded text */}
                <p className="available-inspector-status">
                    {count > 0
                        ? `${count} active assignment${count === 1 ? '' : 's'}`
                        : "No active assignments"
                    }
                </p>

            </div>
            <span className="available-badge">Available</span>
        </div>
    );
};

export default AvailableInspectorCard;