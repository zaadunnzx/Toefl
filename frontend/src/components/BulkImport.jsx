import React, { useState } from 'react'
import { Upload, X, AlertTriangle, CheckCircle, Phone, Trash2 } from 'lucide-react'
import { phoneNumbersAPI } from '../services/api'
import './BulkImport.css'

const BulkImport = ({ categories, onImport, onClose }) => {
  const [numbersText, setNumbersText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [parsedNumbers, setParsedNumbers] = useState([])
  const [duplicateChecks, setDuplicateChecks] = useState({})
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(false)

  const parseNumbers = (text) => {
    const lines = text.split('\n')
    const numbers = []
    
    lines.forEach((line, index) => {
      const trimmed = line.trim()
      if (trimmed) {
        // Remove common separators and extract numbers
        const cleaned = trimmed.replace(/[^\d+]/g, ' ')
        const matches = cleaned.match(/(\+?\d+)/g)
        
        if (matches) {
          matches.forEach(match => {
            if (match.length >= 8) { // Minimum phone number length
              numbers.push({
                id: `temp-${Date.now()}-${Math.random()}`,
                original: match,
                normalized: normalizeNumber(match),
                lineNumber: index + 1,
                isValid: validateNumber(match),
                isDuplicate: false,
                isChecking: false
              })
            }
          })
        }
      }
    })
    
    return numbers
  }

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

  const handleTextChange = (e) => {
    const text = e.target.value
    setNumbersText(text)
    
    if (text.trim()) {
      const parsed = parseNumbers(text)
      setParsedNumbers(parsed)
    } else {
      setParsedNumbers([])
    }
  }

  const checkDuplicates = async () => {
    if (parsedNumbers.length === 0) return
    
    setValidating(true)
    const checks = {}
    
    for (const number of parsedNumbers) {
      if (number.isValid) {
        try {
          number.isChecking = true
          setParsedNumbers([...parsedNumbers])
          
          const response = await phoneNumbersAPI.checkDuplicate(number.normalized)
          checks[number.id] = {
            isDuplicate: response.data.exists,
            existingId: response.data.existingNumber?.id
          }
          
          number.isChecking = false
          number.isDuplicate = response.data.exists
        } catch (error) {
          console.error('Error checking duplicate:', error)
          checks[number.id] = { isDuplicate: false }
          number.isChecking = false
        }
      }
    }
    
    setDuplicateChecks(checks)
    setParsedNumbers([...parsedNumbers])
    setValidating(false)
  }

  const removeNumber = (id) => {
    setParsedNumbers(prev => prev.filter(num => num.id !== id))
  }

  const handleImport = async () => {
    if (!selectedCategory) {
      alert('Please select a category')
      return
    }
    
    const validNumbers = parsedNumbers.filter(num => 
      num.isValid && !num.isDuplicate
    )
    
    if (validNumbers.length === 0) {
      alert('No valid numbers to import')
      return
    }
    
    setLoading(true)
    
    try {
      const numbersData = {
        numbers: validNumbers.map(num => ({
          original_number: num.original,
          normalized_number: num.normalized,
          category_id: parseInt(selectedCategory)
        }))
      }
      
      console.log('Sending bulk import data:', numbersData)
      
      const response = await phoneNumbersAPI.createBulk(numbersData)
      console.log('Bulk import response:', response.data)
      
      if (response.data.success) {
        alert(`Successfully imported ${response.data.data.length} numbers!`)
        onImport() // Refresh the parent component
        onClose()
      } else {
        alert('Import failed: ' + response.data.message)
      }
    } catch (error) {
      console.error('Import error:', error)
      const errorMessage = error.response?.data?.message || 'Failed to import numbers'
      alert('Import failed: ' + errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const validCount = parsedNumbers.filter(num => num.isValid && !num.isDuplicate).length
  const duplicateCount = parsedNumbers.filter(num => num.isDuplicate).length
  const invalidCount = parsedNumbers.filter(num => !num.isValid).length

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bulk-import-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <Upload size={24} />
            Bulk Import Phone Numbers
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="import-steps">
            <div className="step">
              <h3>Step 1: Select Category</h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="step">
              <h3>Step 2: Enter Phone Numbers</h3>
              <p className="step-description">
                Paste your phone numbers below. Each number should be on a new line. 
                Supports various formats: +628123456789, 08123456789, 8123456789
              </p>
              <textarea
                value={numbersText}
                onChange={handleTextChange}
                placeholder="Enter phone numbers (one per line):&#10;+628123456789&#10;08234567890&#10;081234567891"
                className="numbers-textarea"
                rows={8}
              />
            </div>

            {parsedNumbers.length > 0 && (
              <div className="step">
                <h3>Step 3: Review & Validate</h3>
                <div className="validation-summary">
                  <div className="summary-stats">
                    <div className="summary-stat">
                      <span className="stat-number text-success">{validCount}</span>
                      <span className="stat-label">Valid</span>
                    </div>
                    <div className="summary-stat">
                      <span className="stat-number text-warning">{duplicateCount}</span>
                      <span className="stat-label">Duplicates</span>
                    </div>
                    <div className="summary-stat">
                      <span className="stat-number text-error">{invalidCount}</span>
                      <span className="stat-label">Invalid</span>
                    </div>
                  </div>
                  <button 
                    className="btn btn-outline"
                    onClick={checkDuplicates}
                    disabled={validating}
                  >
                    {validating ? 'Checking...' : 'Check Duplicates'}
                  </button>
                </div>

                <div className="numbers-preview">
                  {parsedNumbers.map(number => (
                    <div 
                      key={number.id} 
                      className={`number-item ${!number.isValid ? 'invalid' : ''} ${number.isDuplicate ? 'duplicate' : ''}`}
                    >
                      <div className="number-info">
                        <div className="number-display">
                          <Phone size={16} />
                          <span className="original">{number.original}</span>
                          {number.original !== number.normalized && (
                            <span className="normalized">→ {number.normalized}</span>
                          )}
                        </div>
                        <div className="number-status">
                          {number.isChecking && <div className="spinner small"></div>}
                          {!number.isValid && (
                            <span className="status-badge error">
                              <AlertTriangle size={12} />
                              Invalid
                            </span>
                          )}
                          {number.isDuplicate && (
                            <span className="status-badge warning">
                              <AlertTriangle size={12} />
                              Duplicate
                            </span>
                          )}
                          {number.isValid && !number.isDuplicate && (
                            <span className="status-badge success">
                              <CheckCircle size={12} />
                              Valid
                            </span>
                          )}
                        </div>
                      </div>
                      <button 
                        className="remove-number"
                        onClick={() => removeNumber(number.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleImport}
            disabled={loading || validCount === 0 || !selectedCategory}
          >
            {loading && <div className="spinner"></div>}
            Import {validCount} Numbers
          </button>
        </div>
      </div>
    </div>
  )
}

export default BulkImport