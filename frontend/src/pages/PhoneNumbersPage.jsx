import React, { useState, useEffect } from 'react'
import { Phone, Plus, Search, Trash2, Upload, AlertCircle, CheckCircle, X } from 'lucide-react'
import { phoneNumbersAPI, categoriesAPI } from '../services/api'
import PhoneNumberForm from '../components/PhoneNumberForm'
import PhoneNumberList from '../components/PhoneNumberList'
import BulkImport from '../components/BulkImport'
import './PhoneNumbersPage.css'

const PhoneNumbersPage = () => {
  const [phoneNumbers, setPhoneNumbers] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showBulkImport, setShowBulkImport] = useState(false)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [numbersResponse, categoriesResponse] = await Promise.all([
        phoneNumbersAPI.getAll(),
        categoriesAPI.getAll()
      ])
      
      setPhoneNumbers(numbersResponse.data.data || [])
      setCategories(categoriesResponse.data.data || [])
    } catch (err) {
      setError('Failed to load data')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleAddNumber = async (numberData) => {
    try {
      const response = await phoneNumbersAPI.create(numberData)
      if (response.data.success) {
        setPhoneNumbers(prev => [...prev, response.data.data])
        setShowForm(false)
        showNotification('Phone number added successfully!')
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to add phone number'
      showNotification(errorMsg, 'error')
    }
  }

  const handleBulkImport = async (importedNumbers) => {
    // Callback function called by BulkImport component after successful import
    if (importedNumbers && importedNumbers.length > 0) {
      // Add imported numbers to existing list
      setPhoneNumbers(prev => [...prev, ...importedNumbers]);
      showNotification(`Successfully imported ${importedNumbers.length} numbers!`);
    }
    // Also reload all data to ensure consistency
    await loadData();
    setShowBulkImport(false);
  }

  const handleDeleteNumber = async (id) => {
    if (!confirm('Are you sure you want to delete this phone number?')) return
    
    try {
      const response = await phoneNumbersAPI.delete(id)
      if (response.data.success) {
        setPhoneNumbers(prev => prev.filter(num => num.id !== id))
        showNotification('Phone number deleted successfully!')
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete phone number'
      showNotification(errorMsg, 'error')
    }
  }

  const filteredNumbers = phoneNumbers.filter(number => {
    const matchesSearch = number.original_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         number.normalized_number.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || number.category_id?.toString() === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading phone numbers...</p>
      </div>
    )
  }

  return (
    <div className="phone-numbers-page">
      <div className="container">
        <div className="page-header">
          <div className="page-title-section">
            <h1 className="page-title">
              <Phone size={32} className="gradient-text" />
              Phone Numbers Management
            </h1>
            <p className="page-description">
              Manage your WhatsApp phone numbers with duplicate detection and category organization
            </p>
          </div>
          <div className="page-actions">
            <button 
              className="btn btn-outline"
              onClick={() => setShowBulkImport(true)}
            >
              <Upload size={20} />
              Bulk Import
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <Plus size={20} />
              Add Number
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="content-grid">
          <div className="main-content">
            <div className="filters-section card">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search phone numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-filter"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <PhoneNumberList
              phoneNumbers={filteredNumbers}
              categories={categories}
              onDelete={handleDeleteNumber}
              loading={loading}
            />
          </div>

          <div className="sidebar">
            <div className="stats-card card">
              <h3>Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number gradient-text">{phoneNumbers.length}</span>
                  <span className="stat-label">Total Numbers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number gradient-text">{categories.length}</span>
                  <span className="stat-label">Categories</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number gradient-text">{filteredNumbers.length}</span>
                  <span className="stat-label">Filtered Results</span>
                </div>
              </div>
            </div>

            <div className="quick-actions-card card">
              <h3>Quick Actions</h3>
              <div className="quick-actions">
                <button 
                  className="quick-action btn btn-outline"
                  onClick={() => setShowForm(true)}
                >
                  <Plus size={16} />
                  Add Single Number
                </button>
                <button 
                  className="quick-action btn btn-outline"
                  onClick={() => setShowBulkImport(true)}
                >
                  <Upload size={16} />
                  Bulk Import
                </button>
                <button 
                  className="quick-action btn btn-outline"
                  onClick={loadData}
                >
                  <Search size={16} />
                  Refresh List
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <PhoneNumberForm
          categories={categories}
          onSubmit={handleAddNumber}
          onClose={() => setShowForm(false)}
        />
      )}

      {showBulkImport && (
        <BulkImport
          isOpen={showBulkImport}
          categories={categories}
          onImportSuccess={handleBulkImport}
          onClose={() => setShowBulkImport(false)}
        />
      )}

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            {notification.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{notification.message}</span>
            <button 
              className="notification-close"
              onClick={() => setNotification(null)}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PhoneNumbersPage