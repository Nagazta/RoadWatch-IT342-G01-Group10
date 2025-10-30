import React from 'react';
import Navbar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import '../shared/style/Textpage.css';

function AboutUspage() {
    return (
        <div className="text-page-container">
            <Navbar />
            <main className="text-page-content">
                <div className="container">

                    <div className="page-header">
                        <h1>About RoadWatch</h1>
                        <p>We're on a mission to improve community infrastructure, one report at a time.</p>
                    </div>

                    <section>
                        <h2>Our Story</h2>
                        <p>
                            RoadWatch was founded by a group of community members, engineers, and city planners
                            who were frustrated with the slow and inefficient process of reporting
                            critical infrastructure problems. We saw potholes go unfixed for months,
                            streetlights stay dark, and public spaces fall into disrepair simply
                            because the right information wasn't getting to the right people at the
                            right time.
                        </p>
                        <p>
                            We believed that by using simple, accessible technology, we could bridge
                            the gap between citizens and their local governments. RoadWatch is the
                            result: a streamlined platform that empowers anyone to become an active
                            participant in improving their neighborhood.
                        </p>

                        <h2>Our Mission</h2>
                        <p>
                            Our mission is to make communities safer and more efficient by
                            providing a transparent, easy-to-use tool for reporting and
                            tracking infrastructure issues. We aim to foster accountability and
                            collaboration between residents and public works departments,
                            ensuring that problems are addressed quickly and effectively.
                        </p>
                    </section>

                    <section className="about-section team-section">
                        <h2>Meet the Team</h2>
                        <p>
                            We are a dedicated group of students from the IT342-G01 Systems Integration
                            course, passionate about using technology to solve real-world problems.
                        </p>
                        <div className="team-grid">
                            <div className="team-member">
                                <h4>Kyle Sepulveda</h4>
                                <p>Lead Developer</p>
                            </div>
                            <div className="team-member">
                                <h4>Mitchel Gabrielle Saniel</h4>
                                <p>Front-end Developer</p>
                            </div>
                            <div className="team-member">
                                <h4>Joseph Ericson Tiu</h4>
                                <p>Mobile Developer</p>
                            </div>
                            <div className="team-member">
                                <h4>Joseph Kyle R. Sumucad</h4>
                                <p>Back-end Developer</p>
                            </div>
                        </div>
                    </section>

                </div>
            </main>
            <Footer />
        </div>
    );
}

export default AboutUspage;
