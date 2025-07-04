import React from 'react'
import { Phone, Trash2, Edit3, Copy, ExternalLink } from 'lucide-react'
import './PhoneNumberList.css'

const PhoneNumberList = ({ phoneNumbers, categories, onDelete, onEdit, loading }) => {
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category?.name || 'Unknown'
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const openWhatsApp = (number) => {
    const cleanNumber = number.replace(/\D/g, '')
    window.open(`https://wa.me/${cleanNumber}`, '_blank')
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading phone numbers...</p>
      </div>
    )
  }

  if (phoneNumbers.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <Phone size={48} />
        </div>
        <h3>No phone numbers found</h3>
        <p>Start by adding your first phone number or use bulk import to add multiple numbers at once.</p>
      </div>
    )
  }

  return (
    <div className="phone-numbers-list">
      <div className="list-header">
        <h3>Phone Numbers ({phoneNumbers.length})</h3>
      </div>
      
      <div className="numbers-grid">
        {phoneNumbers.map(number => (
          <div key={number.id} className="number-card card">
            <div className="number-header">
              <div className="number-info">
                <div className="number-display">
                  <Phone size={20} className="number-icon" />
                  <div className="number-details">
                    <span className="original-number">{number.original_number}</span>
                    {number.original_number !== number.normalized_number && (
                      <span className="normalized-number">{number.normalized_number}</span>
                    )}
                  </div>
                </div>
                <div className="category-badge">
                  {getCategoryName(number.category_id)}
                </div>
              </div>
              <div className="number-actions">
                <button
                  className="action-btn copy-btn"
                  onClick={() => copyToClipboard(number.normalized_number)}
                  title="Copy number"
                >
                  <Copy size={16} />
                </button>
                <button
                  className="action-btn whatsapp-btn"
                  onClick={() => openWhatsApp(number.normalized_number)}
                  title="Open in WhatsApp"
                >
                  <ExternalLink size={16} />
                </button>
                {onEdit && (
                  <button
                    className="action-btn edit-btn"
                    onClick={() => onEdit(number)}
                    title="Edit number"
                  >
                    <Edit3 size={16} />
                  </button>
                )}
                <button
                  className="action-btn delete-btn"
                  onClick={() => onDelete(number.id)}
                  title="Delete number"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="number-meta">
              <div className="meta-item">
                <span className="meta-label">Added:</span>
                <span className="meta-value">
                  {new Date(number.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">ID:</span>
                <span className="meta-value">#{number.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PhoneNumberList