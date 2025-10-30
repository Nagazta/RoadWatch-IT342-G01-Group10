import React from 'react';
import Navbar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import '../shared/style/Textpage.css'; // Import the shared CSS

function PrivacyPolicy() {
    return (
        <div className="text-page-container">
            <Navbar />
            <main className="text-page-content">
                <div className="container legal-content">
                    <div className="page-header">
                        <h1>Privacy Policy</h1>
                    </div>

                    <p className="last-updated">Last Updated: October 30, 2025</p>

                    <p>
                        RoadWatch ("we," "us," or "our") is committed to protecting your
                        privacy. This Privacy Policy explains how we collect, use, disclose,
                        and safeguard your information when you use our web application (the
                        "Service"). Please read this privacy policy carefully. If you do not
                        agree with the terms of this privacy policy, please do not access the
                        service.
                    </p>

                    <h2>1. Information We Collect</h2>
                    <p>
                        We may collect personal information from you in a variety of ways when
                        you use our Service.
                    </p>
                    <p>
                        <strong>Personal Data:</strong> Personally identifiable information, such
                        as your name, email address, and telephone number, that you
                        voluntarily give to us when you register with the Service or submit a
                        report.
                    </p>
                    <p>
                        <strong>Report Data:</strong> Information you provide when submitting a
                        report, which includes geographic location data (geolocation),
                        photographs, and descriptions of the road issue.
                    </p>
                    <p>
                        <strong>Usage Data:</strong> Information our servers automatically collect
                        when you access the Service, such as your IP address, browser type,
                        operating system, and the pages you have viewed.
                    </p>

                    <h2>2. How We Use Your Information</h2>
                    <p>
                        Having accurate information permits us to provide you with a smooth,
                        efficient, and customized experience. Specifically, we may use
                        information collected about you via the Service to:
                    </p>
                    <ul>
                        <li>Create and manage your account.</li>
                        <li>
                            Process your reports and transmit them to the relevant
                            municipal authorities or maintenance departments.
                        </li>
                        <li>
                            Provide you with status updates and notifications regarding your
                            submitted reports.
                        </li>
                        <li>
                            Display report information on a public map. (We will anonymize
                            your personal data; only the location and description of the
                            issue will be public).
                        </li>
                        <li>Monitor and analyze usage and trends to improve the Service.</li>
                        <li>
                            Compile anonymous statistical data for our own use or for
                            third-party municipal partners.
                        </li>
                    </ul>

                    <h2>3. Disclosure of Your Information</h2>
                    <p>
                        We may share information we have collected about you in certain
                        situations. Your information may be disclosed as follows:
                    </p>
                    <p>
                        <strong>To Municipal Authorities:</strong> We will share your reports,
                        including location, photos, and descriptions, with the relevant
                        local government or public works departments responsible for
                        addressing the reported issues. Your personal contact information
                        (name, email) may be shared with them for follow-up purposes.
                    </p>
                    <p>
                        <strong>By Law or to Protect Rights:</strong> If we believe the release
                        of information about you is necessary to respond to legal process,
                        to investigate or remedy potential violations of our policies, or
                        to protect the rights, property, and safety of others, we may
                        share your information as permitted or required by any applicable
                        law.
                    </p>
                    <p>
                        <strong>On Public Maps:</strong> The core details of your submitted
                        reports (e.g., issue type, location, photo, description, and
                        status) will be made publicly visible on our map. We will not
                        publicly display your personal information (name, email) on this
                        map.
                    </p>

                    <h2>4. Data Security</h2>
                    <p>
                        We use administrative, technical, and physical security measures to
                        protect your personal information from unauthorized access, use,
                        alteration, and disclosure. These measures include encryption,
                        secure data storage, limited access controls, and regular security
                        reviews.
                    </p>
                    <p>
                        While we take reasonable steps to safeguard your data, please note that
                        no method of transmission over the Internet or electronic storage is
                        100% secure. Therefore, we cannot guarantee absolute security of your
                        information.
                    </p>

                    <h2>5. Data Retention</h2>
                    <p>
                        We retain your personal information only for as long as necessary to
                        fulfill the purposes outlined in this Privacy Policy, comply with
                        legal obligations, resolve disputes, and enforce our agreements. When
                        information is no longer needed, we securely delete or anonymize it.
                    </p>

                    <h2>6. Your Rights and Choices</h2>
                    <p>
                        Depending on your jurisdiction, you may have certain rights regarding
                        your personal information, including the right to:
                    </p>
                    <ul>
                        <li>Access and receive a copy of your personal data we hold about you.</li>
                        <li>Request correction or deletion of inaccurate or incomplete data.</li>
                        <li>Object to or restrict our processing of your personal information.</li>
                        <li>Withdraw your consent at any time (where applicable).</li>
                    </ul>
                    <p>
                        To exercise these rights, please contact us using the information
                        provided below.
                    </p>

                    <h2>7. Changes to This Privacy Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time to reflect changes
                        in our practices, technologies, legal requirements, or other factors.
                        When we make material changes, we will update the “Last Updated” date
                        at the top of this page. We encourage you to review this policy
                        periodically to stay informed about how we protect your information.
                    </p>

                    <h2>8. Contact Us</h2>
                    <p>
                        If you have any questions or concerns about this Privacy Policy or our
                        data practices, please contact us at:
                    </p>
                    <p>
                        <strong>RoadWatch</strong><br />
                        📧 <a href="mailto:support@roadwatch.com">support@roadwatch.com</a><br />
                        📍 [123 Innovation Drive Tech City, 12345]
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default PrivacyPolicy;
