import React from 'react';
import './App.css';
import Header from './Component/Header';
import Footer from './Component/Footer';
import Profile from './Component/Profile';
import LandingPg from './Component/LandingPg';
import Login from './Component/Login';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Auth';  // Import your AuthProvider here

function App() {
  return (
    <Router> {/* Wrap the entire app inside Router */}
      <AuthProvider> {/* Wrap AuthProvider inside Router */}
        <Header />
        <Routes>
          <Route path="/" element={<LandingPg />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<div>About Page</div>} />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
