import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RoadmapPage from './pages/RoadmapPage';
import StepDetailPage from './pages/StepDetailPage';
import QuizPage from './pages/QuizPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/roadmap/:id" element={<RoadmapPage />} />
            <Route path="/roadmap/:id/step/:stepId" element={<StepDetailPage />} />
            <Route path="/roadmap/:id/step/:stepId/quiz" element={<QuizPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
