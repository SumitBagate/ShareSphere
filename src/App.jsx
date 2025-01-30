import { useState } from 'react'
import './App.css'
import Header from './Component/Header'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Header />
      
      <Routes>
        {/* Define Routes here */}
        <Route path="/" element={<div>Home Page</div>} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  )
}

export default App
