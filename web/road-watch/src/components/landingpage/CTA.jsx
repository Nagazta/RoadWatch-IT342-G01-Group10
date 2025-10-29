import React from 'react';
import './CTA.css';
import { Link } from 'react-router-dom';

function CTA() {
    return (
        <section className="cta-section">
            <div className="container">
                <h2>Ready to Make a Difference?</h2>
                <p>
                    Join thousands of other citizens and help us build safer,
                    better-maintained communities, one report at a time.
                </p>
                <div className="cta-buttons">
                    <Link to="/report" className="btn btn-primary">Report a Road Issue</Link>
                    <Link to="/Landingpage/Loginpage" className="btn btn-secondary">Sign In</Link>
                </div>
            </div>
        </section>
    );
}

export default CTA;