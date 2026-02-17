import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer>
            <div class="footer-container">
                <div class="footer-top">
                    <div class="footer-brand">
                        <Link to="/" class="footer-logo">
                            <img src="/assets/logo.svg" alt="Passageway" class="logo-image" style={{ height: '50px' }} />
                        </Link>
                        <p class="footer-desc">Your partner for innovation and growth in the age of artificial intelligence.
                            We specialize in transforming complex data challenges into competitive advantages.</p>
                        <div class="contact-info">
                            <p>✉ info@pssgway.com</p>
                            <p>📞 +91-7742543582</p>
                        </div>
                    </div>

                    <div class="footer-col">
                        <h4>SERVICES</h4>
                        <Link to="/services">Machine Learning</Link>
                        <Link to="/services">Multi-Agent AI</Link>
                        <Link to="/services">Data Engineering</Link>
                        <Link to="/services">Business Intelligence</Link>
                        <Link to="/services">Enterprise Apps</Link>
                    </div>

                    <div class="footer-col">
                        <h4>INDUSTRIES</h4>
                        <Link to="/solutions">Food Technology</Link>
                        <Link to="/solutions">Sports & Entertainment</Link>
                        <Link to="/solutions">Energy & IoT</Link>
                        <Link to="/solutions">Manufacturing</Link>
                    </div>

                    <div class="footer-col">
                        <h4>COMPANY</h4>
                        <Link to="/values">About Us</Link>
                        <Link to="/values">Our Values</Link>
                        <Link to="/partners">Partners</Link>
                        <Link to="/contact">Contact Us</Link>
                    </div>
                </div>

                <div class="footer-bottom">
                    © 2025 Passageway Tech Private Limited. All rights reserved. <br />
                    Building the future of AI-powered business solutions
                </div>
            </div>
        </footer>
    );
};

export default Footer;
