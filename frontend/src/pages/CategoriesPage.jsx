import React, { useState, useEffect } from 'react'
import { Tags, Plus, Search, Edit3, Trash2, AlertCircle, CheckCircle, X } from 'lucide-react'
import { categoriesAPI } from '../services/api'
import './CategoriesPage.css'

const CategoriesPage = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [notification, setNotification] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const response = await categoriesAPI.getAll()
      setCategories(response.data.data || [])
    } catch (err) {
      setError('Failed to load categories')
      console.error('Error loading categories:', err)
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      showNotification('Category name is required', 'error')
      return
    }

    try {
      if (editingCategory) {
        const response = await categoriesAPI.update(editingCategory.id, formData)
        if (response.data.success) {
          setCategories(prev => 
            prev.map(cat => 
              cat.id === editingCategory.id ? response.data.data : cat
            )
          )
          showNotification('Category updated successfully!')
        }
      } else {
        const response = await categoriesAPI.create(formData)
        if (response.data.success) {
          setCategories(prev => [...prev, response.data.data])
          showNotification('Category created successfully!')
        }
      }
      
      resetForm()
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to save category'
      showNotification(errorMsg, 'error')
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    
    try {
      const response = await categoriesAPI.delete(id)
      if (response.data.success) {
        setCategories(prev => prev.filter(cat => cat.id !== id))
        showNotification('Category deleted successfully!')
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete category'
      showNotification(errorMsg, 'error')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', description: '' })
    setEditingCategory(null)
    setShowForm(false)
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading categories...</p>
      </div>
    )
  }

  return (
    <div className="categories-page">
      <div className="container">
        <div className="page-header">
          <div className="page-title-section">
            <h1 className="page-title">
              <Tags size={32} className="gradient-text" />
              Categories Management
            </h1>
            <p className="page-description">
              Organize your phone numbers into categories for better management
            </p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            <Plus size={20} />
            Add Category
          </button>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="content-section">
          <div className="filters-section card">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="categories-grid">
            {filteredCategories.map(category => (
              <div key={category.id} className="category-card card">
                <div className="category-header">
                  <div className="category-info">
                    <h3 className="category-name">{category.name}</h3>
                    {category.description && (
                      <p className="category-description">{category.description}</p>
                    )}
                  </div>
                  <div className="category-actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(category)}
                      title="Edit category"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(category.id)}
                      title="Delete category"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="category-meta">
                  <div className="meta-item">
                    <span className="meta-label">Created:</span>
                    <span className="meta-value">
                      {new Date(category.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">ID:</span>
                    <span className="meta-value">#{category.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && !loading && (
            <div className="empty-state">
              <div className="empty-icon">
                <Tags size={48} />
              </div>
              <h3>No categories found</h3>
              <p>
                {searchTerm 
                  ? 'No categories match your search criteria.' 
                  : 'Start by creating your first category to organize your phone numbers.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="category-form-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <Tags size={24} />
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>
              <button className="modal-close" onClick={resetForm}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Category Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter category description"
                  className="form-input textarea"
                  rows={3}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? 'Update' : 'Create'} Category
                </button>
              </div>
            </form>
          </div>
        </div>
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

export default CategoriesPage