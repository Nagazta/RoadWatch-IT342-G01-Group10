import React from 'react';
import Navbar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import '../shared/style/Textpage.css'; // Import the shared CSS

function Featurespage() {
    return (
        <div className="text-page-container">
            <Navbar />
            <main className="text-page-content">
                <div className="container">
                    <div className="page-header">
                        <h1>Features</h1>
                        <p>What RoadWatch offers to build better communities.</p>
                    </div>

                    <section>
                        <h2>Instant Reporting</h2>
                        <p>
                            Users can submit a report in under 60 seconds. Our simple, intuitive
                            form allows you to pin the exact location on a map, upload a photo,
                            and select the issue type (e.g., Pothole, Broken Streetlight, Faded Markings).
                        </p>

                        <h2>Live Issue Mapping</h2>
                        <p>
                            View all reported issues in your area on a live, interactive map.
                            Filter by issue type, status (reported, in-progress, resolved), or
                            date. This transparency keeps everyone informed and aware of
                            problem areas.
                        </p>

                        <h2>Real-Time Status Updates</h2>
                        <p>
                            Once you submit a report, you'll receive real-time notifications
                            as its status changes. Get alerts when your report is
                            acknowledged, when a maintenance team is assigned, and when the
                            issue is officially resolved.
                        </p>

                        <h2>Data & Analytics Dashboard</h2>
                        <p>
                            For municipal authorities and inspectors, RoadWatch provides a
                            powerful dashboard. View statistics on report volumes, average
                            resolution times, and recurring problem hotspots to make
                            data-driven decisions about infrastructure priorities and budgeting.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Featurespage;