import React from 'react';

const Services = () => {
    return (
        <div className="fade-in">
            <div className="page-header">
                <h1 className="page-title">Our Expertise</h1>
                <p className="page-subtitle">Comprehensive AI & Machine Learning services designed to transform your business
                    operations and drive growth.</p>
            </div>

            <section className="services-section fade-in">
                <div className="services-grid">
                    <div className="service-card" style={{ animationDelay: '0s' }}>
                        <span className="service-icon">✦</span>
                        <h3>Predictive Intelligence & ML</h3>
                        <p>Move beyond descriptive analytics. We deploy proprietary algorithms for demand sensing, fault
                            prediction, and dynamic pricing that turn historical data into future competitive advantage.</p>
                        <ul className="service-features">
                            <li>Predictive Maintenance</li>
                            <li>Demand & Sales Forecasting</li>
                            <li>Customer Churn Prediction</li>
                        </ul>
                    </div>

                    <div className="service-card" style={{ animationDelay: '0.1s' }}>
                        <span className="service-icon">✦</span>
                        <h3>Autonomous Agent Systems</h3>
                        <p>Orchestrate complex industrial workflows with swarms of intelligent agents. From assisted reality to
                            automated negotiation, our agents operate autonomously to execute business goals.</p>
                        <ul className="service-features">
                            <li>Multi-Agent Architectures</li>
                            <li>Process Automation</li>
                            <li>Intelligent Assistants</li>
                        </ul>
                    </div>

                    <div className="service-card" style={{ animationDelay: '0.2s' }}>
                        <span className="service-icon">✦</span>
                        <h3>Data Engineering</h3>
                        <p>Robust pipelines ensuring seamless data flow.</p>
                        <ul className="service-features">
                            <li>Pipeline Architecture</li>
                            <li>IoT Integration</li>
                            <li>Real-time Processing</li>
                        </ul>
                    </div>

                    <div className="service-card" style={{ animationDelay: '0.3s' }}>
                        <span className="service-icon">✦</span>
                        <h3>Computer Vision & Perception</h3>
                        <p>Give your systems the ability to see. We deploy industrial-grade vision models for automated quality
                            control, asset tracking, and workplace safety monitoring.</p>
                        <ul className="service-features">
                            <li>Automated Defect Recognition</li>
                            <li>OCR & Document Processing</li>
                            <li>Object Detection & Tracking</li>
                        </ul>
                    </div>

                    <div className="service-card" style={{ animationDelay: '0.4s' }}>
                        <span className="service-icon">✦</span>
                        <h3>Business Intelligence</h3>
                        <p>Transform improved decision making with interactive dashboards and reports tailored to your business
                            needs.</p>
                        <ul className="service-features">
                            <li>Interactive Dashboards</li>
                            <li>Performance Tracking</li>
                            <li>Custom Reporting</li>
                        </ul>
                    </div>

                    <div className="service-card" style={{ animationDelay: '0.5s' }}>
                        <span className="service-icon">✦</span>
                        <h3>Enterprise Apps</h3>
                        <p>Custom software solutions designed to streamline operations and enhance productivity across your
                            organization.</p>
                        <ul className="service-features">
                            <li>Custom Web Applications</li>
                            <li>Mobile App Development</li>
                            <li>System Integration</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;
