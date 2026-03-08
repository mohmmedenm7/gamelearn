import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RoadmapPage from './pages/RoadmapPage';
import StepDetailPage from './pages/StepDetailPage';
import QuizPage from './pages/QuizPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
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

              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
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
