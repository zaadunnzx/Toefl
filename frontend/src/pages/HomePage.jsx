import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Users, Database, ArrowRight, CheckCircle } from 'lucide-react'
import './HomePage.css'

const HomePage = () => {
  const features = [
    {
      icon: Phone,
      title: 'Phone Number Management',
      description: 'Store and organize WhatsApp numbers with validation and normalization'
    },
    {
      icon: Users,
      title: 'Category System',
      description: 'Organize numbers into dynamic categories for better management'
    },
    {
      icon: Database,
      title: 'Duplicate Detection',
      description: 'Automatically detect and prevent duplicate phone numbers'
    }
  ]

  const benefits = [
    'International phone number format support',
    'Real-time duplicate checking',
    'Bulk phone number import',
    'Category-based organization',
    'REST API integration',
    'Mobile-responsive interface'
  ]

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content animate-fade-in-up">
            <h1 className="hero-title">
              Manage Your <span className="gradient-text">WhatsApp Numbers</span>
              <br />
              Like Never Before
            </h1>
            <p className="hero-description">
              Organize, validate, and manage your WhatsApp phone numbers with our powerful 
              management system. Built for efficiency and designed for scale.
            </p>
            <div className="hero-actions">
              <Link to="/phone-numbers" className="btn btn-primary">
                Get Started
                <ArrowRight size={20} />
              </Link>
              <Link to="/categories" className="btn btn-outline">
                Manage Categories
              </Link>
            </div>
          </div>
          <div className="hero-visual animate-fade-in">
            <div className="hero-card">
              <div className="card-header">
                <Phone size={32} className="gradient-text" />
                <h3>Phone Numbers</h3>
              </div>
              <div className="card-stats">
                <div className="stat">
                  <span className="stat-number gradient-text">1,247</span>
                  <span className="stat-label">Total Numbers</span>
                </div>
                <div className="stat">
                  <span className="stat-number gradient-text">5</span>
                  <span className="stat-label">Categories</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title gradient-text">Powerful Features</h2>
            <p className="section-description">
              Everything you need to manage your WhatsApp numbers efficiently
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card card animate-fade-in-up">
                <div className="feature-icon">
                  <feature.icon size={32} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <div className="benefits-content">
            <div className="benefits-text">
              <h2 className="section-title">
                Why Choose Our <span className="gradient-text">Number Manager</span>?
              </h2>
              <p className="section-description">
                Built with modern technologies and best practices to provide you 
                with the most reliable phone number management solution.
              </p>
              <div className="benefits-list">
                {benefits.map((benefit, index) => (
                  <div key={index} className="benefit-item">
                    <CheckCircle size={20} className="benefit-icon" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              <Link to="/phone-numbers" className="btn btn-secondary">
                Start Managing Numbers
                <ArrowRight size={20} />
              </Link>
            </div>
            <div className="benefits-visual">
              <div className="floating-card card">
                <h4>Quick Actions</h4>
                <div className="quick-actions">
                  <div className="quick-action">
                    <Phone size={16} />
                    <span>Add Number</span>
                  </div>
                  <div className="quick-action">
                    <Users size={16} />
                    <span>Create Category</span>
                  </div>
                  <div className="quick-action">
                    <Database size={16} />
                    <span>Check Duplicates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">
              Ready to <span className="gradient-text">Get Started</span>?
            </h2>
            <p className="cta-description">
              Join thousands of users who trust our platform for managing their WhatsApp numbers.
            </p>
            <div className="cta-actions">
              <Link to="/phone-numbers" className="btn btn-primary btn-lg">
                Start Now
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage