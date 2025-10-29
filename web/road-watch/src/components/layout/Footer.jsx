import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer-section">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-about">
                        <h3 className="footer-logo">RoadWatch</h3>
                        <p>Reporting road damage, simplified. Helping build better communities together.</p>
                    </div>
                    <div className="footer-links">
                        <h4>Features</h4>
                        <ul>
                            <li><Link to="/report">Submit Report</Link></li>
                            <li><Link to="/map">View Map</Link></li>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h4>Support</h4>
                        <ul>
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/help">Help Center</Link></li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h4>Legal</h4>
                        <ul>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2025 RoadWatch. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;