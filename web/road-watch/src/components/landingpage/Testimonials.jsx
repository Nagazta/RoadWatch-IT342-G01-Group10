import React from 'react';
import './Testimonials.css';

function Testimonials() {
    return (
        <section className="testimonials-section">
            <div className="container">
                <h2>What Our Users Say</h2>
                <div className="testimonial-card">
                    <blockquote>
                        "RoadWatch made it so easy to report the pothole on my street. It was fixed within a week!"
                    </blockquote>
                    <p className="testimonial-author">- Sarah, Local Resident</p>
                </div>
            </div>
        </section>
    );
}

export default Testimonials;