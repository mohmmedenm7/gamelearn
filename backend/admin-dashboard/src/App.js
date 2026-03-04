import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import StatsPage from './pages/StatsPage';
import RoadmapsPage from './pages/RoadmapsPage';
import StepsPage from './pages/StepsPage';
import ContentPage from './pages/ContentPage';
import UsersPage from './pages/UsersPage';
import './App.css';

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to="/" replace /> : children;
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<StatsPage />} />
                <Route path="roadmaps" element={<RoadmapsPage />} />
                <Route path="roadmaps/:roadmapId/steps" element={<StepsPage />} />
                <Route path="steps/:stepId/content" element={<ContentPage />} />
                <Route path="users" element={<UsersPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;
