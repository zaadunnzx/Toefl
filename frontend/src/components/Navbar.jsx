import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone, Tags, Home } from 'lucide-react'
import './Navbar.css'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/phone-numbers', label: 'Phone Numbers', icon: Phone },
    { path: '/categories', label: 'Categories', icon: Tags },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="logo">
            <div className="logo-icon">
              <Phone size={24} />
            </div>
            <span className="logo-text gradient-text">WhatsApp Manager</span>
          </div>
        </Link>

        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`navbar-item ${isActive(path) ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        <button
          className="navbar-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  )
}

export default Navbar