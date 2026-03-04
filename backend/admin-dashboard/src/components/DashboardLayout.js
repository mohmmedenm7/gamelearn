import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FaRoute, FaChartBar, FaMap, FaUsers,
    FaSignOutAlt, FaUser
} from 'react-icons/fa';
import './DashboardLayout.css';

const navItems = [
    { to: '/', icon: <FaChartBar />, label: 'الإحصائيات', end: true },
    { to: '/roadmaps', icon: <FaMap />, label: 'خرائط الطريق' },
    { to: '/users', icon: <FaUsers />, label: 'المستخدمون' },
];

function DashboardLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <FaRoute />
                    </div>
                    <div>
                        <div className="sidebar-brand">خارطة التعلم</div>
                        <div className="sidebar-brand-sub">Admin Panel</div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        <div className="sidebar-avatar">
                            <FaUser />
                        </div>
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name">{user?.name}</div>
                            <div className="sidebar-user-role">مدير النظام</div>
                        </div>
                    </div>
                    <button className="sidebar-logout-btn" onClick={handleLogout} id="logout-btn">
                        <FaSignOutAlt />
                        <span>خروج</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="dashboard-main">
                <div className="dashboard-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default DashboardLayout;
