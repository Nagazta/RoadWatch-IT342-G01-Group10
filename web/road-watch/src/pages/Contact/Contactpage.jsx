import React, { useState } from 'react';
import Navbar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import '../shared/style/Textpage.css'; // Import the shared CSS

function Contactpage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic to send form data
        console.log("Form submitted:", { name, email, message });
        alert("Thank you for your message!");
        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <div className="text-page-container">
            <Navbar />
            <main className="text-page-content">
                <div className="container">
                    <div className="page-header">
                        <h1>Get In Touch</h1>
                        <p>Have questions or feedback? We'd love to hear from you.</p>
                    </div>

                    <div className="contact-layout">
                        <div className="contact-info">
                            <h2>Contact Information</h2>
                            <p>
                                <strong>Email:</strong><br />
                                support@roadwatch.com
                            </p>
                            <p>
                                <strong>Phone:</strong><br />
                                (123) 456-7890
                            </p>
                            <p>
                                <strong>Address:</strong><br />
                                123 Innovation Drive<br />
                                Tech City, 12345
                            </p>
                        </div>

                        <form className="contact-form" onSubmit={handleSubmit}>
                            <h2>Send us a Message</h2>
                            <div className="input-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Contactpage;