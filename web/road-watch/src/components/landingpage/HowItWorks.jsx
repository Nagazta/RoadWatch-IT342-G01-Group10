import React from 'react';
import './HowItWorks.css';

function HowItWorks() {
    return (
        <section className="how-it-works-section">
            <div className="container">
                <h2>How RoadWatch Works</h2>
                <p className="subtitle">
                    Simple, efficient, and transparent. Follow citizen reports in real-time and help fix road damage in
                    your community.
                </p>
                <div className="steps-container">
                    <div className="step-item">
                        <div className="step-number">1</div>
                        <h3>Report Your Issue</h3>
                        <p>See a pothole or road damage? Open the app, pin the location, and our system will automatically document it.</p>
                    </div>
                    <div className="step-item">
                        <div className="step-number">2</div>
                        <h3>Authorities Review</h3>
                        <p>Local authorities review the report, assess the urgency, and assign it to a maintenance team.</p>
                    </div>
                    <div className="step-item">
                        <div className="step-number">3</div>
                        <h3>Track Progress</h3>
                        <p>Get notified when your report is assigned, in-progress, and finally resolved. See the fix for yourself!</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;