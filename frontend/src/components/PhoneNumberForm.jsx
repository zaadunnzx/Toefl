import React, { useState, useEffect } from 'react'
import { Phone, X, AlertCircle, CheckCircle } from 'lucide-react'
import { phoneNumbersAPI } from '../services/api'
import './PhoneNumberForm.css'

const PhoneNumberForm = ({ categories, onSubmit, onClose, editData = null }) => {
  const [formData, setFormData] = useState({
    original_number: '',
    category_id: ''
  })
  const [normalizedNumber, setNormalizedNumber] = useState('')
  const [duplicateCheck, setDuplicateCheck] = useState(null)
  const [isChecking, setIsChecking] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editData) {
      setFormData({
        original_number: editData.original_number,
        category_id: editData.category_id?.toString() || ''
      })
    }
  }, [editData])

  const normalizeNumber = (number) => {
    let normalized = number.replace(/[^\d+]/g, '')
    
    // Convert Indonesian format (08xx) to international (+628xx)
    if (normalized.startsWith('08')) {
      normalized = '+62' + normalized.substring(1)
    } else if (normalized.startsWith('8') && !normalized.startsWith('+')) {
      normalized = '+62' + normalized
    } else if (!normalized.startsWith('+')) {
      normalized = '+' + normalized
    }
    
    return normalized
  }

  const validateNumber = (number) => {
    const normalized = normalizeNumber(number)
    return /^\+\d{8,15}$/.test(normalized)
  }

  const handleNumberChange = async (e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, original_number: value }))
    
    if (value.trim()) {
      const normalized = normalizeNumber(value)
      setNormalizedNumber(normalized)
      
      // Clear previous errors
      setErrors(prev => ({ ...prev, original_number: '' }))
      
      // Validate format
      if (!validateNumber(value)) {
        setErrors(prev => ({ 
          ...prev, 
          original_number: 'Invalid phone number format' 
        }))
        setDuplicateCheck(null)
        return
      }
      
      // Check for duplicates (debounced)
      setIsChecking(true)
      setTimeout(async () => {
        try {
          const response = await phoneNumbersAPI.checkDuplicate(normalized)
          setDuplicateCheck({
            exists: response.data.exists,
            existingNumber: response.data.existingNumber
          })
        } catch (error) {
          console.error('Error checking duplicate:', error)
        } finally {
          setIsChecking(false)
        }
      }, 500)
    } else {
      setNormalizedNumber('')
      setDuplicateCheck(null)
      setErrors(prev => ({ ...prev, original_number: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    const newErrors = {}
    if (!formData.original_number.trim()) {
      newErrors.original_number = 'Phone number is required'
    } else if (!validateNumber(formData.original_number)) {
      newErrors.original_number = 'Invalid phone number format'
    }
    
    if (!formData.category_id) {
      newErrors.category_id = 'Category is required'
    }
    
    if (duplicateCheck?.exists && !editData) {
      newErrors.original_number = 'This phone number already exists'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setLoading(true)
    
    try {
      const submitData = {
        ...formData,
        normalized_number: normalizedNumber,
        category_id: parseInt(formData.category_id)
      }
      
      await onSubmit(submitData)
    } catch (error) {
      console.error('Submit error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="phone-form-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <Phone size={24} />
            {editData ? 'Edit Phone Number' : 'Add Phone Number'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="phone-form">
          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
            <div className="phone-input-group">
              <input
                id="phone"
                type="text"
                value={formData.original_number}
                onChange={handleNumberChange}
                placeholder="Enter phone number (e.g., +6281234567890, 08123456789)"
                className={`form-input ${errors.original_number ? 'error' : ''}`}
                disabled={loading}
              />
              <div className="input-status">
                {isChecking && <div className="spinner small"></div>}
                {duplicateCheck?.exists && (
                  <AlertCircle size={16} className="status-icon error" />
                )}
                {normalizedNumber && !duplicateCheck?.exists && !isChecking && validateNumber(formData.original_number) && (
                  <CheckCircle size={16} className="status-icon success" />
                )}
              </div>
            </div>
            {normalizedNumber && (
              <div className="normalized-display">
                <span className="normalized-label">Normalized:</span>
                <span className="normalized-value">{normalizedNumber}</span>
              </div>
            )}
            {errors.original_number && (
              <div className="error-message">
                <AlertCircle size={16} />
                {errors.original_number}
              </div>
            )}
            {duplicateCheck?.exists && (
              <div className="duplicate-warning">
                <AlertCircle size={16} />
                This number already exists in the system
                {duplicateCheck.existingNumber && (
                  <span className="existing-info">
                    (ID: {duplicateCheck.existingNumber.id})
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              value={formData.category_id}
              onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
              className={`form-select ${errors.category_id ? 'error' : ''}`}
              disabled={loading}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <div className="error-message">
                <AlertCircle size={16} />
                {errors.category_id}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || isChecking || (duplicateCheck?.exists && !editData)}
            >
              {loading && <div className="spinner"></div>}
              {editData ? 'Update' : 'Add'} Number
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PhoneNumberForm