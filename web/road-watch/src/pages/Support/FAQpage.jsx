import React from 'react';
import Navbar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import '../shared/style/Textpage.css'; // Import the shared CSS

function FAQpage() {
    return (
        <div className="text-page-container">
            <Navbar />
            <main className="text-page-content">
                <div className="container">
                    <div className="page-header">
                        <h1>Support & FAQ</h1>
                        <p>Frequently Asked Questions</p>
                    </div>

                    <div className="faq-list">
                        <div className="faq-item">
                            <h3>How do I report an issue?</h3>
                            <p>
                                Click the "Report a Road Issue" button on the homepage or from
                                your dashboard. Pin the location on the map, upload a photo
                                (optional but recommended), select the issue type, and add a
                                short description.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h3>Do I need to create an account to report?</h3>
                            <p>
                                Yes, creating a free account is required. This allows us to
                                provide you with status updates on your report and helps us
                                prevent spam, ensuring that all reports are genuine.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h3>What kind of issues can I report?</h3>
                            <p>
                                You can report any non-emergency public road or street-related
                                issue, including potholes, broken streetlights, faded road
                                markings, damaged signs, debris on the road, or malfunctioning
                                traffic signals.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h3>Who fixes the road damage?</h3>
                            <p>
                                RoadWatch is a platform that connects citizens with their
                                local government. We route your report directly to the
                                dashboard of the correct municipal authority or public works
                                department responsible for maintenance in your area.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default FAQpage;