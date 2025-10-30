import React from 'react';
import Navbar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import '../shared/style/Textpage.css'; // Import the shared CSS

function TermsOfService() {
    return (
        <div className="text-page-container">
            <Navbar />
            <main className="text-page-content">
                <div className="container legal-content">
                    <div className="page-header">
                        <h1>Terms of Service</h1>
                    </div>

                    <p className="last-updated">Last Updated: October 30, 2025</p>

                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using the RoadWatch service, you agree to be bound
                        by these Terms of Service. If you disagree with any part of the
                        terms, then you do not have permission to access the service.
                    </p>

                    <h2>2. User Accounts</h2>
                    <p>
                        When you create an account with us, you must provide information
                        that is accurate, complete, and current at all times. Failure to
                        do so constitutes a breach of the Terms, which may result in
                        immediate termination of your account on our service.
                    </p>

                    <h2>3. User Conduct</h2>
                    <p>
                        You agree not to use the service to submit false, misleading, or
                        malicious reports. You are responsible for all activities that
                        occur under your account.
                    </p>
                    {/* Add more placeholder sections as needed */}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default TermsOfService;