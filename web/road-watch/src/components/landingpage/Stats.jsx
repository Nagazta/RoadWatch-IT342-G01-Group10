import React from 'react';
import './Stats.css';

function Stats() {
    return (
        <section className="stats-section">
            <div className="container">
                <div className="stats-grid">
                    <div className="stat-item">
                        <h2>12,847</h2>
                        <p>Reports Submitted</p>
                    </div>
                    <div className="stat-item">
                        <h2>9,234</h2>
                        <p>Issues Resolved</p>
                    </div>
                    <div className="stat-item">
                        <h2>3.2 days</h2>
                        <p>Average Resolution Time</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Stats;