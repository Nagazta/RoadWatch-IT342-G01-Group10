import React from 'react';
import './Hero.css';
import { Link } from 'react-router-dom';

function Hero() {
    return (
        <section className="hero-section">
            <div className="container">
                <h1>Report Road Damage. Build Better Communities.</h1>
                <p>
                    Report issues easily, work with your city, and see the real impact in your community.
                    From potholes to brokens streetlights, your voice matters.
                </p>
                <div className="hero-buttons">
                    <Link to="/report" className="btn btn-primary">Report a Road Issue</Link>
                    <Link to="/how-it-works" className="btn btn-secondary">Learn More</Link>
                </div>
            </div>
        </section>
    );
}

export default Hero;