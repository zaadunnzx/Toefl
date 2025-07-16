# 🎨 Frontend Components Documentation

## Project Structure

```
frontend/
├── src/
│   ├── components/           # Reusable components
│   │   ├── BulkImport.jsx   # Bulk import modal
│   │   ├── BulkImport.css   # Bulk import styles
│   │   ├── Navbar.jsx       # Navigation bar
│   │   ├── Navbar.css       # Navigation styles
│   │   └── ...
│   ├── pages/               # Page components
│   │   ├── HomePage.jsx     # Landing page
│   │   ├── HomePage.css     # Landing page styles
│   │   ├── PhoneNumbersPage.jsx  # Phone numbers management
│   │   ├── CategoriesPage.jsx    # Categories management
│   │   └── ...
│   ├── services/            # API services
│   │   └── api.js          # API client
│   ├── styles/             # Global styles
│   │   ├── index.css       # Global CSS variables
│   │   └── theme.css       # Theme definitions
│   ├── App.jsx             # Main app component
│   ├── App.css             # App styles
│   └── main.jsx            # Entry point
├── public/                 # Static assets
├── package.json           # Dependencies
└── vite.config.js         # Build configuration
```

---

## Core Components

### 1. App Component (`App.jsx`)
Main application component that handles routing and global state.

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PhoneNumbersPage from './pages/PhoneNumbersPage';
import CategoriesPage from './pages/CategoriesPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/phone-numbers" element={<PhoneNumbersPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
```

**Features:**
- React Router for navigation
- Global layout structure
- Route management

---

### 2. Navbar Component (`components/Navbar.jsx`)
Responsive navigation bar with mobile menu support.

```jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          📱 WhatsApp Numbers
        </Link>
        
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/phone-numbers" 
            className={`nav-link ${isActive('/phone-numbers') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Phone Numbers
          </Link>
          <Link 
            to="/categories" 
            className={`nav-link ${isActive('/categories') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Categories
          </Link>
        </div>
        
        <div className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
}
```

**Features:**
- Responsive design
- Mobile hamburger menu
- Active link highlighting
- Smooth animations

**CSS Classes:**
- `.navbar` - Main navigation container
- `.nav-container` - Content wrapper
- `.nav-logo` - Logo/brand element
- `.nav-menu` - Navigation links container
- `.nav-link` - Individual navigation links
- `.nav-toggle` - Mobile menu toggle

---

### 3. BulkImport Component (`components/BulkImport.jsx`)
Modal component for bulk importing phone numbers.

```jsx
import { useState, useEffect } from 'react';
import { X, Upload, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import './BulkImport.css';

function BulkImport({ isOpen, onClose, categories, onImport }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [numbersText, setNumbersText] = useState('');
  const [parsedNumbers, setParsedNumbers] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Parse and validate numbers
  useEffect(() => {
    if (numbersText.trim()) {
      parseNumbers(numbersText);
    } else {
      setParsedNumbers([]);
    }
  }, [numbersText]);

  const parseNumbers = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const numbers = lines.map((line, index) => {
      const cleanNumber = line.trim();
      return {
        index,
        original: cleanNumber,
        normalized: normalizeNumber(cleanNumber),
        isValid: validateNumber(cleanNumber),
        isDuplicate: false // Will be checked via API
      };
    });
    setParsedNumbers(numbers);
  };

  const normalizeNumber = (number) => {
    // Remove formatting characters
    let cleaned = number.replace(/[\s\-\(\)\.\+]/g, '');
    
    // Handle Indonesian numbers
    if (cleaned.startsWith('62')) {
      cleaned = '+' + cleaned;
    } else if (cleaned.startsWith('08')) {
      cleaned = '+62' + cleaned.substring(1);
    } else if (cleaned.startsWith('8') && cleaned.length >= 10) {
      cleaned = '+62' + cleaned;
    } else if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    
    return cleaned;
  };

  const validateNumber = (number) => {
    const normalized = normalizeNumber(number);
    return /^\+\d{8,15}$/.test(normalized);
  };

  const handleImport = async () => {
    if (!selectedCategory) {
      alert('Please select a category');
      return;
    }

    const validNumbers = parsedNumbers.filter(num => num.isValid);
    if (validNumbers.length === 0) {
      alert('No valid numbers to import');
      return;
    }

    setIsProcessing(true);
    
    const numbersToImport = validNumbers.map(num => ({
      original_number: num.original,
      normalized_number: num.normalized,
      category_id: parseInt(selectedCategory)
    }));

    try {
      await onImport(numbersToImport);
      onClose();
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="bulk-import-modal">
        <div className="modal-header">
          <h2>
            <Upload size={24} />
            Bulk Import Phone Numbers
          </h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
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
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Enter Numbers */}
            <div className="step">
              <h3>Step 2: Enter Phone Numbers</h3>
              <p className="step-description">
                Paste your phone numbers below. Each number should be on a new line. 
                Supports various formats: +628123456789, 08123456789, 8123456789
              </p>
              <textarea
                value={numbersText}
                onChange={(e) => setNumbersText(e.target.value)}
                placeholder={`+62 813-4321-6935\n+62 851-5917-7290\n08123456789\n8123456789`}
                className="numbers-textarea"
              />
            </div>

            {/* Step 3: Preview and Validate */}
            {parsedNumbers.length > 0 && (
              <div className="step">
                <h3>Step 3: Preview and Validate</h3>
                <div className="validation-summary">
                  <div className="summary-stats">
                    <div className="summary-stat">
                      <span className="stat-number text-primary">
                        {parsedNumbers.length}
                      </span>
                      <span className="stat-label">Total</span>
                    </div>
                    <div className="summary-stat">
                      <span className="stat-number text-success">
                        {parsedNumbers.filter(n => n.isValid).length}
                      </span>
                      <span className="stat-label">Valid</span>
                    </div>
                    <div className="summary-stat">
                      <span className="stat-number text-error">
                        {parsedNumbers.filter(n => !n.isValid).length}
                      </span>
                      <span className="stat-label">Invalid</span>
                    </div>
                  </div>
                </div>

                <div className="numbers-preview">
                  {parsedNumbers.map((number, index) => (
                    <div
                      key={index}
                      className={`number-item ${!number.isValid ? 'invalid' : ''}`}
                    >
                      <div className="number-info">
                        <div className="number-display">
                          <span className="original">{number.original}</span>
                          {number.normalized !== number.original && (
                            <span className="normalized">→ {number.normalized}</span>
                          )}
                        </div>
                      </div>
                      <div className="number-status">
                        {number.isValid ? (
                          <span className="status-badge success">
                            <CheckCircle size={16} />
                            Valid
                          </span>
                        ) : (
                          <span className="status-badge error">
                            <AlertCircle size={16} />
                            Invalid
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleImport}
            disabled={!selectedCategory || parsedNumbers.filter(n => n.isValid).length === 0 || isProcessing}
          >
            {isProcessing ? 'Importing...' : `Import ${parsedNumbers.filter(n => n.isValid).length} Numbers`}
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Features:**
- Real-time number parsing and validation
- Visual feedback for valid/invalid numbers
- Category selection
- Progress indication
- Error handling

**Props:**
- `isOpen`: Boolean to control modal visibility
- `onClose`: Function to close modal
- `categories`: Array of available categories
- `onImport`: Function to handle import process

---

### 4. HomePage Component (`pages/HomePage.jsx`)
Landing page with hero section and feature highlights.

```jsx
import { Link } from 'react-router-dom';
import { Phone, Users, Upload, Search, Shield, Zap } from 'lucide-react';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Manage Your WhatsApp Numbers
            <span className="gradient-text"> Effortlessly</span>
          </h1>
          <p className="hero-description">
            Organize, categorize, and manage thousands of WhatsApp phone numbers 
            with our powerful bulk import and real-time duplicate detection system.
          </p>
          <div className="hero-actions">
            <Link to="/phone-numbers" className="btn btn-primary btn-large">
              Get Started
            </Link>
            <Link to="/categories" className="btn btn-secondary btn-large">
              Manage Categories
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card">
            <Phone size={48} />
            <h3>10,000+</h3>
            <p>Numbers Managed</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Powerful Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Upload size={32} />
              </div>
              <h3>Bulk Import</h3>
              <p>Import thousands of phone numbers at once with intelligent parsing and validation.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={32} />
              </div>
              <h3>Duplicate Detection</h3>
              <p>Automatically detect and prevent duplicate phone numbers in real-time.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Users size={32} />
              </div>
              <h3>Smart Categories</h3>
              <p>Organize your contacts with dynamic categories for better management.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Search size={32} />
              </div>
              <h3>Advanced Search</h3>
              <p>Find any contact instantly with powerful search and filtering options.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={32} />
              </div>
              <h3>Lightning Fast</h3>
              <p>Optimized performance for handling large datasets without compromising speed.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <Phone size={32} />
              </div>
              <h3>WhatsApp Ready</h3>
              <p>Direct integration with WhatsApp for seamless communication.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of users who trust our platform for their contact management needs.</p>
            <Link to="/phone-numbers" className="btn btn-primary btn-large">
              Start Managing Numbers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
```

**Features:**
- Responsive hero section
- Feature highlights with icons
- Call-to-action sections
- Smooth animations
- Mobile-optimized layout

---

## Styling System

### CSS Variables (`styles/index.css`)
```css
:root {
  /* Colors */
  --primary: #667eea;
  --primary-dark: #5a67d8;
  --secondary: #764ba2;
  --success: #48bb78;
  --warning: #ed8936;
  --error: #f56565;
  
  /* Background */
  --bg-primary: #0f0f23;
  --bg-secondary: #16213e;
  --bg-card: rgba(255, 255, 255, 0.05);
  --bg-card-hover: rgba(255, 255, 255, 0.1);
  
  /* Text */
  --text-primary: #ffffff;
  --text-secondary: #a0aec0;
  --text-muted: #718096;
  
  /* Border */
  --border-color: rgba(255, 255, 255, 0.1);
  --border-focus: #667eea;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.16);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.2);
  
  /* Transitions */
  --transition: all 0.3s ease;
}
```

### Component Styling Guidelines

#### 1. Button Styles
```css
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
}

.btn-secondary {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-large {
  padding: 16px 32px;
  font-size: 1.1rem;
}
```

#### 2. Card Styles
```css
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 24px;
  backdrop-filter: blur(20px);
  transition: var(--transition);
}

.card:hover {
  background: var(--bg-card-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

#### 3. Form Styles
```css
.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-primary);
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  transition: var(--transition);
}

.form-input:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
```

---

## State Management

### API Service (`services/api.js`)
```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/api/categories'),
  create: (data) => api.post('/api/categories', data),
  update: (id, data) => api.put(`/api/categories/${id}`, data),
  delete: (id) => api.delete(`/api/categories/${id}`),
};

// Phone Numbers API
export const phoneNumbersAPI = {
  getAll: () => api.get('/api/phone-numbers'),
  create: (data) => api.post('/api/phone-numbers', data),
  createBulk: (data) => api.post('/api/phone-numbers/bulk', data),
  checkDuplicate: (number) => api.post('/api/phone-numbers/check', { number }),
  update: (id, data) => api.put(`/api/phone-numbers/${id}`, data),
  delete: (id) => api.delete(`/api/phone-numbers/${id}`),
};

export default api;
```

---

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
.container {
  width: 100%;
  padding: 0 16px;
  margin: 0 auto;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    max-width: 768px;
    padding: 0 24px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
    padding: 0 32px;
  }
}

/* Large Desktop */
@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}
```

### Mobile Optimizations
```css
/* Mobile Navigation */
@media (max-width: 767px) {
  .nav-menu {
    position: fixed;
    left: -100%;
    top: 70px;
    flex-direction: column;
    background: var(--bg-secondary);
    width: 100%;
    text-align: center;
    transition: 0.3s;
    box-shadow: var(--shadow-lg);
  }
  
  .nav-menu.active {
    left: 0;
  }
  
  .nav-toggle {
    display: block;
  }
}

/* Mobile Cards */
@media (max-width: 767px) {
  .features-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .feature-card {
    padding: 16px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
}
```

---

## Performance Optimization

### Code Splitting
```jsx
// Lazy loading components
import { lazy, Suspense } from 'react';

const PhoneNumbersPage = lazy(() => import('./pages/PhoneNumbersPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/phone-numbers" element={<PhoneNumbersPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
      </Routes>
    </Suspense>
  );
}
```

### Memoization
```jsx
import { memo, useMemo, useCallback } from 'react';

const PhoneNumberItem = memo(({ phoneNumber, onDelete, onEdit }) => {
  const handleDelete = useCallback(() => {
    onDelete(phoneNumber.id);
  }, [phoneNumber.id, onDelete]);

  const formattedDate = useMemo(() => {
    return new Date(phoneNumber.created_at).toLocaleDateString();
  }, [phoneNumber.created_at]);

  return (
    <div className="phone-number-item">
      {/* Component content */}
    </div>
  );
});
```

---

## Testing

### Component Testing Setup
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

### Example Test
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Navbar Component', () => {
  test('renders navigation links', () => {
    renderWithRouter(<Navbar />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Phone Numbers')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });

  test('toggles mobile menu', () => {
    renderWithRouter(<Navbar />);
    
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);
    
    expect(screen.getByTestId('nav-menu')).toHaveClass('active');
  });
});
```

---

## Build and Deployment

### Build Configuration (`vite.config.js`)
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['lucide-react'],
          utils: ['axios']
        }
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
```

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Serve with static server
npx serve dist
```

This documentation provides a comprehensive guide to the frontend components, styling system, and development practices used in the WhatsApp Numbers Management System.