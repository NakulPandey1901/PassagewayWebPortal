import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

    return (
        <>
            {/* Overlay */}
            <div
                className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <ul className="sidebar-links">
                    <li>
                        <Link to="/" onClick={onClose} className={location.pathname === '/' ? 'active' : ''}>Home</Link>
                    </li>
                    <li>
                        <Link to="/services" onClick={onClose} className={location.pathname === '/services' ? 'active' : ''}>Services</Link>
                    </li>
                    <li>
                        <Link to="/solutions" onClick={onClose} className={location.pathname === '/solutions' ? 'active' : ''}>Solutions</Link>
                    </li>
                    <li>
                        <Link to="/values" onClick={onClose} className={location.pathname === '/values' ? 'active' : ''}>Values</Link>
                    </li>
                    <li>
                        <Link to="/partners" onClick={onClose} className={location.pathname === '/partners' ? 'active' : ''}>Partners</Link>
                    </li>
                    <li>
                        <Link to="/contact" onClick={onClose} className="sidebar-cta">Get Started</Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;
