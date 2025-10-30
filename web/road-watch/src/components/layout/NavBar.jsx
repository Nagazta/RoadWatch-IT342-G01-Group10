import React from 'react';
import './NavBar.css'; // Import the specific CSS
import { Link } from 'react-router-dom'; // Using Link for navigation

function NavBar() {
    return (
        <nav className="navbar">
            <div className="container">
                {/* You can replace this text with your logo image */}
                <Link to="/" className="nav-logo">RoadWatch</Link>

                <ul className="nav-links">
                    <li><Link to="/features">Features</Link></li>
                    <li><Link to="/how-it-works">How It Works</Link></li>
                    <li><Link to="/about-us">About Us</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>

                <div className="nav-auth">
                    <Link to="/Landing/Login" className="btn btn-secondary">Login</Link>
                    <Link to="/Landing/Registration" className="btn btn-primary">Get Started</Link>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;