import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import PhoneNumbersPage from './pages/PhoneNumbersPage'
import CategoriesPage from './pages/CategoriesPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/phone-numbers" element={<PhoneNumbersPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App