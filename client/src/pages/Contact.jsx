import React, { useState } from 'react';
import axios from 'axios';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        message: ''
    });
    const [status, setStatus] = useState(null); // success, error, submitting

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (status === 'submitting') return;

        setStatus('submitting');

        try {
            const dataToSubmit = {
                ...formData,
                timestamp: new Date().toLocaleString(),
                access_key: '53b23622-8fcb-49c8-95ac-a595d08a040a',
                subject: 'New Contact Form Submission from Passageway Website',
                from_name: 'Passageway Contact Form'
            };

            // 1. Send to Web3Forms
            const emailReq = axios.post('https://api.web3forms.com/submit', dataToSubmit);

            // 2. Send to Backend
            const sheetReq = axios.post('/api/contact', dataToSubmit);

            const [emailRes] = await Promise.all([
                emailReq,
                sheetReq.catch(err => console.error("Sheet Error:", err))
            ]);

            if (emailRes.data.success) {
                setStatus('success');
                setFormData({ name: '', email: '', company: '', message: '' });
                setTimeout(() => setStatus(null), 5000);
            } else {
                throw new Error(emailRes.data.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
        }
    };

    return (
        <div className="fade-in">
            <div className="page-header">
                <h1 className="page-title">Contact Us</h1>
                <p className="page-subtitle">Ready to transform your data into intelligence? Let's talk.</p>
            </div>

            <section style={{ maxWidth: '700px', margin: '0 auto', padding: '0 2rem 8rem' }}>
                <div style={{ background: 'var(--bg-white)', padding: '3rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '1rem', textAlign: 'center', fontWeight: 400 }}>Get in Touch</h2>
                    <p style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Schedule a free consultation with our experts today.</p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Name *</label>
                                <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '6px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none' }}
                                />
                            </div>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Email *</label>
                                <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '6px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="company" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Company</label>
                            <input type="text" id="company" name="company" value={formData.company} onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '6px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none' }}
                            />
                        </div>

                        <div>
                            <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Message *</label>
                            <textarea id="message" name="message" required rows="5" value={formData.message} onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '6px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                            ></textarea>
                        </div>

                        <button type="submit" className="cta-button" disabled={status === 'submitting'}
                            style={{ background: 'var(--accent)', color: 'white', padding: '1rem', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', opacity: status === 'submitting' ? 0.7 : 1 }}>
                            {status === 'submitting' ? 'Sending...' : 'Send Message'}
                        </button>

                        {status === 'success' && <div style={{ padding: '1rem', borderRadius: '6px', textAlign: 'center', fontSize: '0.9rem', color: 'green', display: 'block' }}>Thanks! We've received your message and will be in touch shortly.</div>}
                        {status === 'error' && <div style={{ padding: '1rem', borderRadius: '6px', textAlign: 'center', fontSize: '0.9rem', color: 'red', display: 'block' }}>Something went wrong. Please try again or email us directly.</div>}
                    </form>

                    <div style={{ marginTop: '3rem', paddingTop: '3rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                        <p style={{ marginBottom: '0.5rem', fontWeight: 500 }}>General Inquiries</p>
                        <a href="mailto:info@pssgway.com" style={{ color: 'var(--accent)', textDecoration: 'none' }}>info@pssgway.com</a>
                        <p style={{ marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: 500 }}>Phone</p>
                        <a href="tel:+919058404387" style={{ color: 'var(--accent)', textDecoration: 'none' }}>+91-9058404387</a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
