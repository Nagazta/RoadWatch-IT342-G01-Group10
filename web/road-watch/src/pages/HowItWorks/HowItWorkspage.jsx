import React from 'react';
import Navbar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import '../shared/style/Textpage.css'; // Import the shared CSS

function HowItWorkspage() {
    return (
        <div className="text-page-container">
            <Navbar />
            <main className="text-page-content">
                <div className="container">
                    <div className="page-header">
                        <h1>How It Works</h1>
                        <p>A simple, transparent process for community improvement.</p>
                    </div>

                    <section>
                        <h2>Step 1: Report The Issue</h2>
                        <p>
                            When you (a citizen) find a road-related problem, you open the
                            RoadWatch app. You tap "New Report," pin the location on the map,
                            snap a quick photo, and add a brief description. This entire
                            process is designed to be as fast and easy as possible.
                        </p>

                        <h2>Step 2: Authorities Review & Assign</h2>
                        <p>
                            The report instantly appears on the dashboard of the local
                            municipal authority or inspector. They review the report for
                            validity, assess its priority level, and assign it to the
                            appropriate maintenance team. The report's status is updated to
                            "In Progress."
                        </p>

                        <h2>Step 3: Track & Resolve</h2>
                        <p>
                            The maintenance crew performs the repair. Once the work is
                            complete, they mark the issue as "Resolved" and may upload a photo
                            of the fixed problem. The citizen who reported the issue (and
                            anyone else following it) receives a final notification. The
                            resolved issue is updated on the public map.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default HowItWorkspage;