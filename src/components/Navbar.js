import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaRoute, FaHome, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar({ onLoginClick }) {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const { user, logout } = useAuth();

    return (
        <nav className="navbar glass">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <div className="navbar-logo">
                        <FaRoute />
                    </div>
                    <div className="navbar-title">
                        <span className="navbar-title-ar">خارطة التعلم</span>
                        <span className="navbar-title-en">GameLearn</span>
                    </div>
                </Link>

                <div className="navbar-actions">
                    {!isHome && (
                        <Link to="/" className="navbar-btn navbar-home-btn">
                            <FaHome />
                            <span>الرئيسية</span>
                        </Link>
                    )}

                    {user ? (
                        <div className="navbar-user-actions">
                            <Link to="/profile" className="navbar-btn navbar-profile-btn">
                                <FaUserCircle />
                                <span>{user.name}</span>
                            </Link>
                            <button onClick={logout} className="navbar-btn navbar-logout-btn">
                                <FaSignOutAlt />
                            </button>
                        </div>
                    ) : (
                        <button onClick={onLoginClick} className="navbar-btn navbar-login-btn">
                            <FaUserCircle />
                            <span>دخول / تسجيل</span>
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
