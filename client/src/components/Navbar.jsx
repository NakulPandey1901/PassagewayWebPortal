import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const Navbar = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <nav>
            <div className="nav-container">
                {/* Hamburger Button */}
                <button className="hamburger-btn" onClick={toggleSidebar}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>

                <Link to="/" className="logo">
                    <img src="/assets/logo.svg" alt="Passageway" className="logo-image" />
                </Link>
                <ul className="nav-links">
                    <li><Link to="/services" className={location.pathname === '/services' ? 'active' : ''}>Services</Link></li>
                    <li><Link to="/solutions" className={location.pathname === '/solutions' ? 'active' : ''}>Solutions</Link></li>
                    <li><Link to="/values" className={location.pathname === '/values' ? 'active' : ''}>Values</Link></li>
                    <li><Link to="/partners" className={location.pathname === '/partners' ? 'active' : ''}>Partners</Link></li>
                </ul>
                <Link to="/contact" className="cta-button">Get Started</Link>
            </div>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </nav>
    );
};

export default Navbar;
