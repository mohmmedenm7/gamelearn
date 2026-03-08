import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RoadmapPage from './pages/RoadmapPage';
import StepDetailPage from './pages/StepDetailPage';
import QuizPage from './pages/QuizPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import GroupsPage from './pages/GroupsPage';
import GroupDetailPage from './pages/GroupDetailPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProjectSubmissionPage from './pages/ProjectSubmissionPage';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar onLoginClick={() => setIsLoginModalOpen(true)} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage onLoginClick={() => setIsLoginModalOpen(true)} />} />
              <Route path="/roadmap/:id" element={<RoadmapPage />} />
              <Route path="/roadmap/:id/step/:stepId" element={<StepDetailPage />} />
              <Route path="/roadmap/:id/step/:stepId/quiz" element={<QuizPage />} />
              <Route path="/roadmap/:id/step/:stepId/project" element={<ProjectSubmissionPage />} />

              {/* Auth & Profile Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Leaderboard Routes */}
              <Route path="/leaderboard" element={<LeaderboardPage />} />

              {/* Groups Routes */}
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/groups/:id" element={<GroupDetailPage />} />
            </Routes>
          </main>

          <LoginPage
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
