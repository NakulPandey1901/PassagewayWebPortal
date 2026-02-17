import React from 'react';

const Values = () => {
    return (
        <div className="fade-in">
            <div className="page-header">
                <h1 className="page-title">ENTIRE</h1>
                <p className="page-subtitle">The principles that guide every decision and relationship we build.</p>
            </div>

            <section className="fade-in">
                <div className="values-grid">
                    <div className="value-card">
                        <div className="value-icon">E</div>
                        <h3>Empathy</h3>
                        <p>We deeply understand our clients' challenges and build solutions that truly address their needs.</p>
                    </div>
                    <div className="value-card">
                        <div className="value-icon">N</div>
                        <h3>Nimble</h3>
                        <p>We adapt quickly to changing business landscapes, delivering agile solutions that keep you ahead.</p>
                    </div>
                    <div className="value-card">
                        <div className="value-icon">T</div>
                        <h3>Trust</h3>
                        <p>Transparency and reliability are at the core of our relationships. We build systems you can depend on.</p>
                    </div>
                    <div className="value-card">
                        <div className="value-icon">I</div>
                        <h3>Intelligence</h3>
                        <p>We leverage cutting-edge AI to unlock insights that drive transformative outcomes across your business.</p>
                    </div>
                    <div className="value-card">
                        <div className="value-icon">R</div>
                        <h3>Responsible</h3>
                        <p>We champion ethical AI development, ensuring our solutions are secure, unbiased, and sustainable.</p>
                    </div>
                    <div className="value-card">
                        <div className="value-icon">E</div>
                        <h3>Entrepreneur</h3>
                        <p>We think like owners, taking initiative and constantly seeking innovative ways to create value.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Values;
