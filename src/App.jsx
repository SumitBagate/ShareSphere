import React from 'react';
import './App.css';
import Header from './Component/Header';
import Footer from './Component/Footer';
import Profile from './Component/profile';
import LandingPg from './Component/LandingPg';
import Register from './Component/Register';
import Login from './Component/Login';
import Dashboard from './Component/Dashboard';

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './Auth';
import Upload from './Component/uploads';
import FileList from './Component/FileList';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <MainContent />
      </AuthProvider>
    </Router>
  );
}

// Separate the main content to use useLocation
function MainContent() {
  const location = useLocation();

  // Define pages where the footer should be shown
  const showFooterPages = [ '/about'];
  const hideFooterOnPages = ['/LandinPg'];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPg />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/uploads" element={<Upload />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/about" element={<div>About Page</div>} />
          <Route path="/FileList" element={<FileList />} />
        </Routes>
      </main>

      {/* Conditionally render the Footer */}
      {showFooterPages.includes(location.pathname) && <Footer />}
    </div>
  );
}

export default App;
