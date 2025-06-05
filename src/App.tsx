// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlobalStyle from './styles/globalStyles';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Callback from './components/Callback';
import ParticleBackground from './components/ParticleBackground';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';

const App = () => {
  const { token } = useAuth();
  const { theme } = useTheme();

  return (
    <>
      <GlobalStyle theme={theme} />
      <Router>
        <ParticleBackground />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/dashboard" element={
              token ? <Dashboard /> : <Navigate to="/login" />
            } />
            <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
          </Routes>
        </motion.div>
      </Router>
    </>
  );
};

export default App;
