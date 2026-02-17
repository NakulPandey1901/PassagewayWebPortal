import React from 'react';

const Partners = () => {
    return (
        <div className="fade-in">
            <div className="page-header">
                <h1 className="page-title">Trusted By</h1>
                <p className="page-subtitle">Building the future of AI together with industry leaders.</p>
            </div>

            <section className="fade-in">
                <div className="partners-grid">
                    <div className="partner-card">
                        <div className="partner-logo">TG</div>
                        <h3>TradeGrub</h3>
                        <p>Trading & Investment Platform</p>
                    </div>
                    <div className="partner-card">
                        <div className="partner-logo">GP</div>
                        <h3>Genus Power</h3>
                        <p>Energy Management</p>
                    </div>
                    <div className="partner-card">
                        <div className="partner-logo">LF</div>
                        <h3>ListenFirst</h3>
                        <p>Analytics Platform</p>
                    </div>
                    <div className="partner-card">
                        <div className="partner-logo">+</div>
                        <h3>Your Company</h3>
                        <p>Join our network</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Partners;
