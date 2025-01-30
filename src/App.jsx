import { useState } from 'react'
import './App.css'
import Header from './Component/Header'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Footer from './Component/Footer'
import Profile from './Component/Profile'

import Landingpg from './Component/LandingPg'

function App() {
  const [count, setCount] = useState(0)
  const showFooter = true;
  return (
    <Router>
      <Header />
      
      <Routes>
       
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/profile" element={<Profile />} />
     
        <Route path="/about" element={<div>About Page</div>} />

        <Route path="/landingPg" element={<Landingpg   showFooter={false}  />} />   

      </Routes>
   
    </Router>
     


  )
}

export default App
