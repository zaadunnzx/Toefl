import React, { useState, useEffect, useCallback } from 'react';
import { categoriesAPI, phoneNumbersAPI } from '../services/api';
import { normalizePhoneNumber, validatePhoneNumber, parsePhoneNumbers } from '../utils/phoneUtils';
import './BulkImport.css';

const BulkImport = ({ isOpen, onClose, onImportSuccess, categories: propCategories }) => {
  const [categories, setCategories] = useState(propCategories || []);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [phoneNumbersText, setPhoneNumbersText] = useState('');
  const [parsedNumbers, setParsedNumbers] = useState([]);
  const [validNumbers, setValidNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [errors, setErrors] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Parse and validate phone numbers whenever text changes
  useEffect(() => {
    if (phoneNumbersText.trim()) {
      const numbers = parsePhoneNumbers(phoneNumbersText);
      setParsedNumbers(numbers);
      
      // Validate each number
      const validated = numbers.map((number, index) => {
        const validation = validatePhoneNumber(number);
        return {
          index,
          original: number,
          normalized: validation.normalized,
          isValid: validation.isValid,
          error: validation.isValid ? null : validation.message,
          isDuplicate: false,
          isChecking: false
        };
      });
      
      setValidNumbers(validated);
      
      // Check for duplicates
      checkForDuplicates(validated);
    } else {
      setParsedNumbers([]);
      setValidNumbers([]);
    }
  }, [phoneNumbersText]);

  const checkForDuplicates = useCallback(async (numbers) => {
    const validNums = numbers.filter(num => num.isValid);
    
    for (let i = 0; i < validNums.length; i++) {
      const num = validNums[i];
      
      // Update checking state
      setValidNumbers(prev => 
        prev.map(n => 
          n.index === num.index ? { ...n, isChecking: true } : n
        )
      );
      
      try {
        const response = await phoneNumbersAPI.checkDuplicate(num.original);
        
        setValidNumbers(prev => 
          prev.map(n => 
            n.index === num.index 
              ? { 
                  ...n, 
                  isDuplicate: response.data.exists, 
                  isChecking: false,
                  existingNumber: response.data.existingNumber
                }
              : n
          )
        );
      } catch (error) {
        console.error('Error checking duplicate:', error);
        setValidNumbers(prev => 
          prev.map(n => 
            n.index === num.index ? { ...n, isChecking: false } : n
          )
        );
      }
    }
  }, []);

  const handleImport = async () => {
    if (!selectedCategory) {
      alert('Please select a category first');
      return;
    }

    const numbersToImport = validNumbers.filter(num => num.isValid && !num.isDuplicate);
    
    if (numbersToImport.length === 0) {
      alert('No valid numbers to import');
      return;
    }

    setImporting(true);
    setErrors([]);

    try {
      const payload = {
        numbers: numbersToImport.map(num => ({
          original_number: num.original,
          normalized_number: num.normalized,
          category_id: parseInt(selectedCategory)
        }))
      };

      console.log('Importing payload:', payload);

      const response = await phoneNumbersAPI.createBulk(payload);
      
      if (response.data.success) {
        const { data, errors: importErrors } = response.data;
        
        if (importErrors && importErrors.length > 0) {
          setErrors(importErrors);
        }
        
        // Show success message
        const successCount = data ? data.length : 0;
        const errorCount = importErrors ? importErrors.length : 0;
        
        alert(`Import completed! ${successCount} numbers imported successfully${errorCount > 0 ? `, ${errorCount} errors` : ''}`);
        
        if (onImportSuccess) {
          onImportSuccess(data);
        }
        
        // Reset form if all successful
        if (errorCount === 0) {
          resetForm();
        }
      }
    } catch (error) {
      console.error('Error importing numbers:', error);
      alert('Error importing numbers: ' + (error.response?.data?.message || error.message));
    } finally {
      setImporting(false);
    }
  };

  const resetForm = () => {
    setSelectedCategory('');
    setPhoneNumbersText('');
    setParsedNumbers([]);
    setValidNumbers([]);
    setErrors([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const removeNumber = (index) => {
    const newNumbers = parsedNumbers.filter((_, i) => i !== index);
    setPhoneNumbersText(newNumbers.join('\n'));
  };

  // Calculate stats
  const totalNumbers = validNumbers.length;
  const validCount = validNumbers.filter(num => num.isValid && !num.isDuplicate).length;
  const duplicateCount = validNumbers.filter(num => num.isDuplicate).length;
  const invalidCount = validNumbers.filter(num => !num.isValid).length;

  // Debug log
  console.log('BulkImport Debug:', {
    totalNumbers,
    validCount,
    duplicateCount,
    invalidCount,
    selectedCategory,
    importing,
    canImport: !importing && selectedCategory && validCount > 0
  });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="bulk-import-modal">
        <div className="modal-header">
          <h2>
            📤 Bulk Import Phone Numbers
          </h2>
          <button className="modal-close" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="import-steps">
            {/* Step 1: Select Category */}
            <div className="step">
              <h3>Step 1: Select Category</h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
                disabled={loading}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Enter Phone Numbers */}
            <div className="step">
              <h3>Step 2: Enter Phone Numbers</h3>
              <p className="step-description">
                Paste your phone numbers below. Each number should be on a new line. 
                Supports various formats: +62 813-4321-6935, +628123456789, 08123456789, 8123456789
              </p>
              <textarea
                value={phoneNumbersText}
                onChange={(e) => setPhoneNumbersText(e.target.value)}
                placeholder="Paste phone numbers here, one per line:
+62 813-4321-6935
+62 851-5917-7290
08123456789
8123456789"
                className="numbers-textarea"
                rows={10}
              />
            </div>

            {/* Validation Summary */}
            {totalNumbers > 0 && (
              <div className="validation-summary">
                <div className="summary-stats">
                  <div className="summary-stat">
                    <span className="stat-number">{totalNumbers}</span>
                    <span className="stat-label">Total</span>
                  </div>
                  <div className="summary-stat">
                    <span className="stat-number text-success">{validCount}</span>
                    <span className="stat-label">Valid</span>
                  </div>
                  <div className="summary-stat">
                    <span className="stat-number text-warning">{duplicateCount}</span>
                    <span className="stat-label">Duplicate</span>
                  </div>
                  <div className="summary-stat">
                    <span className="stat-number text-error">{invalidCount}</span>
                    <span className="stat-label">Invalid</span>
                  </div>
                </div>
              </div>
            )}

            {/* Numbers Preview */}
            {validNumbers.length > 0 && (
              <div className="step">
                <h3>Step 3: Review Numbers</h3>
                <div className="numbers-preview">
                  {validNumbers.map((number, index) => (
                    <div
                      key={index}
                      className={`number-item ${
                        !number.isValid ? 'invalid' : 
                        number.isDuplicate ? 'duplicate' : ''
                      }`}
                    >
                      <div className="number-info">
                        <div className="number-display">
                          <span className="original">{number.original}</span>
                          {number.normalized && (
                            <span className="normalized">→ {number.normalized}</span>
                          )}
                        </div>
                        <div className="number-status">
                          {number.isChecking && (
                            <div className="spinner small">Checking...</div>
                          )}
                          {!number.isChecking && (
                            <span className={`status-badge ${
                              !number.isValid ? 'error' : 
                              number.isDuplicate ? 'warning' : 'success'
                            }`}>
                              {!number.isValid ? 'Invalid' : 
                               number.isDuplicate ? 'Duplicate' : 'Valid'}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        className="remove-number"
                        onClick={() => removeNumber(index)}
                        title="Remove number"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Import Errors */}
            {errors.length > 0 && (
              <div className="step">
                <h3>Import Errors</h3>
                <div className="errors-list">
                  {errors.map((error, index) => (
                    <div key={index} className="error-item">
                      <span>❌ {error.original_number}: {error.error}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleImport}
            disabled={importing || !selectedCategory || validCount === 0}
          >
            {importing ? (
              <>
                <span className="spinner">Importing...</span>
              </>
            ) : (
              `Import ${validCount} Numbers`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkImport;