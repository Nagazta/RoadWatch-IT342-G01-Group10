import React from 'react';

import './style/Mainpage.css';


import Navbar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import Hero from '../../components/landingpage/Hero';
import Stats from '../../components/landingpage/Stats';
import HowItWorks from '../../components/landingpage/HowItWorks';
import Testimonials from '../../components/landingpage/Testimonials';
import CTA from '../../components/landingpage/CTA';

function Mainpage() {
    return (
        <div className="mainpage-container">
            <Navbar />
            <Hero />
            <Stats />
            <HowItWorks />
            <Testimonials />
            <CTA />
            <Footer />
        </div>
    );
}

export default Mainpage;