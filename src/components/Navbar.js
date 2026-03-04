import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaRoute, FaHome } from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <nav className="navbar glass">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <div className="navbar-logo">
                        <FaRoute />
                    </div>
                    <div className="navbar-title">
                        <span className="navbar-title-ar">خارطة التعلم</span>
                        <span className="navbar-title-en">RoadMap</span>
                    </div>
                </Link>

                {!isHome && (
                    <Link to="/" className="navbar-home-btn">
                        <FaHome />
                        <span>الرئيسية</span>
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
