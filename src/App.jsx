import React from 'react';
import './App.css';
import Header from './Component/Header';
import Footer from './Component/Footer';
import Profile from './Component/profile';
import LandingPg from './Component/LandingPg';
import Register from './Component/Register';
import Login from './Component/Login';
import Dashboard from './Component/Dashboard';
import AdminPanel from './Component/AdminPannel';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './Auth';
import Upload from './Component/uploads';
import FileList from './Component/FileList';
import ProtectedRoute from "../src/Component/ProtectRoutes";
import { auth } from "./firebaseConfig"; // adjust path as needed
import { onAuthStateChanged } from "firebase/auth";
import  { useEffect } from 'react';



function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem("authToken", token);
        console.log("Auth token set in localStorage");
      } else {
        localStorage.removeItem("authToken");
        console.log("User signed out — authToken removed");
      }
    });
        // Cleanup listener on unmount
        return () => unsubscribe();
      }, [])
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
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/about" element={<div>About Page</div>} />
          <Route path="/uploads" element={<Upload />} />      
          <Route path="/FileList" element={<FileList />} />
          <Route path="/Admin" element={<AdminPanel />} />
        </Route>
        <Route Path="*" element={<LandingPg />} />
      
        </Routes>
      </main>

      {/* Conditionally render the Footer */}
      {showFooterPages.includes(location.pathname) && <Footer />}
    </div>
  );
}

export default App;
