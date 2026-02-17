import React from 'react';
import { Link } from 'react-router-dom';
import Counter from '../components/Counter';

const Home = () => {
    return (
        <div className="fade-in">
            <section className="hero">
                <h1>Uncovering the <span className="highlight">hidden gems</span> in your data</h1>
                <p className="hero-description">
                    We transform complex data challenges into competitive advantages through cutting-edge AI and machine
                    learning solutions.
                </p>
                <div className="hero-cta-group">
                    <Link to="/services" className="btn-primary">Explore Our Work</Link>
                </div>
            </section>

            <section className="services-section fade-in">
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginBottom: '2rem', fontWeight: 400 }}>
                        The Art of Intelligence
                    </h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                        Like a craftsman refining raw materials into a masterpiece, we meticulously shape raw data into
                        actionable intelligence. Our approach blends technical precision with strategic vision.
                    </p>

                    <div style={{ margin: '3rem 0', textAlign: 'center' }}>
                        <img src="/assets/sketch.svg" alt="AI Core Workflow Sketch"
                            style={{ maxWidth: '100%', height: 'auto', maxHeight: '400px', opacity: 0.9 }} />
                    </div>

                    <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', marginTop: '4rem', flexWrap: 'wrap' }}>
                        <Counter target={2.5} symbol="B+" label="Daily AI Predictions" />
                        <Counter target={98} symbol="%" label="Model Accuracy Rate" />
                        <Counter target={12} symbol="x" label="Faster Decision Making" />
                        <Counter target={40} symbol="%" label="Reduction in OpEx" />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
