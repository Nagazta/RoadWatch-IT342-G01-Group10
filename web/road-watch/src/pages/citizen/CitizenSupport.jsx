import './styles/CitizenSupport.css';
import { SupportIcon, MessageIcon } from '../../components/common/Icons.jsx';
import { useState } from 'react';
import feedbackService from '../../services/api/feedbackService';

const CitizenSupport = () => {
    const [formData, setFormData] = useState({
        category: '',
        subject: '',
        message: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`📝 Field changed: ${name} = ${value}`);
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('📧 Submit button clicked');
        console.log('📋 Form data:', formData);
        
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Check if user is authenticated
            const token = localStorage.getItem('token');
            console.log('🔑 Token exists:', !!token);
            
            if (!token) {
                console.error('❌ No authentication token found');
                setError('You must be logged in to submit feedback');
                setLoading(false);
                return;
            }

            // Prepare feedback data
            const feedbackData = {
                category: formData.category,
                subject: formData.subject,
                message: formData.message,
                email: formData.email
            };

            console.log('📤 Sending feedback to backend:', feedbackData);

            // Submit feedback
            const response = await feedbackService.submitFeedback(feedbackData);
            
            console.log('📥 Backend response:', response);

            if (response.success) {
                console.log('✅ Feedback submitted successfully!');
                setSuccess('Your message has been sent! We will get back to you within 2-3 business days.');
                
                // Reset form after 2 seconds
                setTimeout(() => {
                    setFormData({
                        category: '',
                        subject: '',
                        message: '',
                        email: ''
                    });
                    setSuccess('');
                    console.log('🔄 Form reset');
                }, 2000);
            } else {
                console.error('❌ Feedback submission failed:', response.error);
                setError(response.error || 'Failed to submit feedback. Please try again.');
            }
        } catch (err) {
            console.error('❌ Error submitting feedback:', err);
            setError('An unexpected error occurred. Please try again later.');
        } finally {
            setLoading(false);
            console.log('🏁 Submit process completed');
        }
    };

    const handleCancel = () => {
        console.log('🗑️ Clear form clicked');
        setFormData({
            category: '',
            subject: '',
            message: '',
            email: ''
        });
        setError('');
        setSuccess('');
        console.log('✅ Form cleared');
    };

    return (
        <div className="citizensupport-container">
            <div className="support-header">
                <MessageIcon />
                <div>
                    <h3>Contact Support</h3>
                    <p>Get help with using RoadWatch or share your feedback with our team</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <h4>Submit Support Request</h4>

                {/* Error message */}
                {error && (
                    <div style={{
                        padding: '1vw',
                        backgroundColor: '#fee',
                        border: '1px solid #fcc',
                        borderRadius: '0.5vw',
                        color: '#c33',
                        marginBottom: '1vw',
                        fontSize: '0.9vw'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {/* Success message */}
                {success && (
                    <div style={{
                        padding: '1vw',
                        backgroundColor: '#dfd',
                        border: '1px solid #afa',
                        borderRadius: '0.5vw',
                        color: '#060',
                        marginBottom: '1vw',
                        fontSize: '0.9vw'
                    }}>
                        ✅ {success}
                    </div>
                )}

                <div className="citizensupport-input">
                    <label>Category <span className="required">*</span></label>
                    <select 
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    >
                        <option value="">Select a category...</option>
                        <option value="Technical Issue">Technical Issue</option>
                        <option value="Account Help">Account Help</option>
                        <option value="Report Problem">Report Problem</option>
                        <option value="Feature Request">Feature Request</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="citizensupport-input">
                    <label>Email <span className="required">*</span></label>
                    <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com" 
                        required
                        disabled={loading}
                    />
                </div>

                <div className="citizensupport-input">
                    <label>Subject <span className="required">*</span></label>
                    <input 
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Brief summary of your request" 
                        required
                        disabled={loading}
                    />
                </div>
                
                <div className="citizensupport-input">
                    <label>Message <span className="required">*</span></label>
                    <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Provide detailed information about your request or feedback" 
                        required 
                        rows="6"
                        disabled={loading}
                    />
                </div>

                <p className="support-info">
                    <SupportIcon/> 
                    <span>
                        Your message will be reviewed by our support team. 
                        We typically respond within 2-3 business days via email.
                    </span>
                </p>
                <hr/>

                <div className="citizensupport-buttons">
                    <button 
                        type="button" 
                        className="btn-cancel" 
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Clear Form
                    </button>
                    <button 
                        type="submit" 
                        className="btn-submit"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Message'}
                    </button>
                </div>
            </form>

            {/* Help Section */}
            <div className="support-help-section">
                <h4>Need immediate help?</h4>
                <div className="help-cards">
                    <div className="help-card">
                        <h5>Documentation</h5>
                        <p>Check our user guides and FAQs</p>
                        <a href="#" onClick={(e) => { e.preventDefault(); console.log('📚 Documentation clicked'); }}>
                            View Documentation
                        </a>
                    </div>
                    <div className="help-card">
                        <h5>Community Forum</h5>
                        <p>Connect with other RoadWatch users</p>
                        <a href="#" onClick={(e) => { e.preventDefault(); console.log('💬 Forum clicked'); }}>
                            Visit Forum
                        </a>
                    </div>
                    <div className="help-card">
                        <h5>📞 Emergency Contact</h5>
                        <p>For urgent road safety issues</p>
                        <a 
                            href="tel:911" 
                            onClick={() => console.log('Emergency call initiated')}
                        >
                            Call 911
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CitizenSupport;