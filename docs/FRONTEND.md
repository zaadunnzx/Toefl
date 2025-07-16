# 🎨 Frontend Documentation

## Overview
The frontend is a modern React application built with Vite, featuring a dark theme with glassmorphism effects inspired by Festiva design. It provides an intuitive interface for managing WhatsApp phone numbers and categories.

## Technology Stack
- **React 18** - User interface library
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Modern icon library
- **CSS3** - Custom styling with CSS variables

---

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
│   ├── vite.svg           # Vite logo
│   └── favicon.ico        # Site favicon
├── src/
│   ├── components/        # Reusable components
│   │   ├── Navbar.jsx     # Navigation component
│   │   ├── Navbar.css     # Navigation styles
│   │   ├── BulkImport.jsx # Bulk import modal
│   │   ├── BulkImport.css # Bulk import styles
│   │   ├── PhoneNumberForm.jsx  # Single number form
│   │   ├── PhoneNumberForm.css  # Form styles
│   │   └── PhoneNumberList.jsx  # Numbers list display
│   ├── pages/             # Page components
│   │   ├── HomePage.jsx   # Landing page
│   │   ├── HomePage.css   # Landing page styles
│   │   ├── PhoneNumbersPage.jsx  # Numbers management
│   │   ├── PhoneNumbersPage.css  # Numbers page styles
│   │   ├── CategoriesPage.jsx    # Categories management
│   │   └── CategoriesPage.css    # Categories page styles
│   ├── services/          # API services
│   │   └── api.js         # Axios API configuration
│   ├── App.jsx           # Main app component
│   ├── App.css          # Global app styles
│   ├── index.css        # Global CSS variables
│   └── main.jsx         # App entry point
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

---

## 🎨 Design System

### Color Palette
```css
:root {
  /* Primary Colors */
  --primary: #667eea;
  --primary-dark: #5a67d8;
  --primary-light: #7c3aed;
  
  /* Background Colors */
  --bg-primary: #0f0f23;
  --bg-secondary: #16213e;
  --bg-card: rgba(255, 255, 255, 0.1);
  --bg-card-hover: rgba(255, 255, 255, 0.15);
  
  /* Text Colors */
  --text-primary: #ffffff;
  --text-secondary: #e2e8f0;
  --text-muted: #94a3b8;
  
  /* Border Colors */
  --border-color: rgba(255, 255, 255, 0.1);
  --border-focus: #667eea;
  
  /* Status Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}
```

### Typography
```css
/* Font Stack */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Font Sizes */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
```

### Spacing System
```css
/* Spacing Scale */
--space-1: 0.25rem;     /* 4px */
--space-2: 0.5rem;      /* 8px */
--space-3: 0.75rem;     /* 12px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-8: 2rem;        /* 32px */
--space-10: 2.5rem;     /* 40px */
--space-12: 3rem;       /* 48px */
--space-16: 4rem;       /* 64px */
--space-20: 5rem;       /* 80px */
```

---

## 🧩 Components

### Navbar Component
Navigation bar with responsive design and active link highlighting.

**Features:**
- Responsive hamburger menu for mobile
- Active route highlighting
- Smooth animations
- Dark theme integration

**Usage:**
```jsx
import Navbar from './components/Navbar'

function App() {
  return (
    <div>
      <Navbar />
      {/* Other components */}
    </div>
  )
}
```

### BulkImport Component
Modal component for importing multiple phone numbers at once.

**Features:**
- Real-time phone number validation
- Duplicate detection
- Progress tracking
- Error reporting
- Category selection

**Props:**
```jsx
<BulkImport
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onImport={handleBulkImport}
  categories={categories}
/>
```

**Key Methods:**
- `parseNumbers()` - Parse and validate input numbers
- `checkDuplicates()` - Real-time duplicate checking
- `handleImport()` - Process bulk import
- `validateNumber()` - Individual number validation

### PhoneNumberForm Component
Form for adding single phone numbers.

**Features:**
- Real-time validation
- Auto-formatting
- Category selection
- Error handling

**Props:**
```jsx
<PhoneNumberForm
  onSubmit={handleAddNumber}
  categories={categories}
  loading={isLoading}
/>
```

### PhoneNumberList Component
Display component for phone numbers with search and filter capabilities.

**Features:**
- Search functionality
- Category filtering
- Pagination
- Copy to clipboard
- WhatsApp integration
- Bulk actions

**Props:**
```jsx
<PhoneNumberList
  numbers={phoneNumbers}
  categories={categories}
  onDelete={handleDelete}
  onEdit={handleEdit}
  searchTerm={searchTerm}
  selectedCategory={selectedCategory}
/>
```

---

## 📄 Pages

### HomePage
Landing page with hero section and feature overview.

**Sections:**
- Hero with call-to-action
- Features showcase
- Benefits overview
- Getting started guide

### PhoneNumbersPage
Main page for managing phone numbers.

**Features:**
- Phone numbers list with pagination
- Search and filter functionality
- Add single number form
- Bulk import modal
- Export functionality
- Statistics dashboard

**State Management:**
```jsx
const [phoneNumbers, setPhoneNumbers] = useState([])
const [categories, setCategories] = useState([])
const [loading, setLoading] = useState(true)
const [searchTerm, setSearchTerm] = useState('')
const [selectedCategory, setSelectedCategory] = useState('')
const [showBulkImport, setShowBulkImport] = useState(false)
```

### CategoriesPage
Page for managing categories.

**Features:**
- Categories list
- Add/Edit/Delete categories
- Search functionality
- Category statistics
- Bulk actions

---

## 🌐 API Integration

### API Service Configuration
```javascript
// src/services/api.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)
```

### API Methods
```javascript
// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/api/categories'),
  getById: (id) => api.get(`/api/categories/${id}`),
  create: (data) => api.post('/api/categories', data),
  update: (id, data) => api.put(`/api/categories/${id}`, data),
  delete: (id) => api.delete(`/api/categories/${id}`),
}

// Phone Numbers API
export const phoneNumbersAPI = {
  getAll: () => api.get('/api/phone-numbers'),
  getById: (id) => api.get(`/api/phone-numbers/${id}`),
  create: (data) => api.post('/api/phone-numbers', data),
  createBulk: (data) => api.post('/api/phone-numbers/bulk', data),
  checkDuplicate: (number) => api.post('/api/phone-numbers/check', { number }),
  update: (id, data) => api.put(`/api/phone-numbers/${id}`, data),
  delete: (id) => api.delete(`/api/phone-numbers/${id}`),
}
```

---

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) { }

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) { }

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) { }

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) { }

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) { }
```

### Mobile Navigation
```jsx
// Mobile hamburger menu
const [isMenuOpen, setIsMenuOpen] = useState(false)

return (
  <nav className="navbar">
    <div className="navbar-container">
      <Link to="/" className="navbar-brand">
        <Phone className="navbar-icon" />
        WhatsApp Manager
      </Link>
      
      <button 
        className="navbar-toggle"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X /> : <Menu />}
      </button>
      
      <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
        {/* Navigation items */}
      </div>
    </div>
  </nav>
)
```

---

## 🎭 Animations

### CSS Animations
```css
/* Fade in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide in from right */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Pulse animation */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Usage */
.fade-in {
  animation: fadeIn 0.5s ease-out;
}

.slide-in-right {
  animation: slideInRight 0.3s ease-out;
}

.pulse {
  animation: pulse 2s infinite;
}
```

### Loading States
```jsx
// Loading component
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
)

// Loading styles
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

---

## 🎯 State Management

### useState Patterns
```jsx
// Simple state
const [count, setCount] = useState(0)

// Object state
const [user, setUser] = useState({
  name: '',
  email: '',
  phone: ''
})

// Array state
const [items, setItems] = useState([])

// Boolean state
const [isLoading, setIsLoading] = useState(false)
const [isModalOpen, setIsModalOpen] = useState(false)
```

### useEffect Patterns
```jsx
// Component mount
useEffect(() => {
  loadData()
}, [])

// Dependency tracking
useEffect(() => {
  filterData()
}, [searchTerm, selectedCategory])

// Cleanup
useEffect(() => {
  const timer = setTimeout(() => {
    // Do something
  }, 1000)
  
  return () => clearTimeout(timer)
}, [])
```

### Custom Hooks
```jsx
// useLocalStorage hook
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

// useDebounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
```

---

## 🛠️ Utilities

### Phone Number Utilities
```javascript
// Format phone number for display
export const formatPhoneNumber = (number) => {
  if (!number) return ''
  
  // Remove all non-digits except +
  const cleaned = number.replace(/[^\d+]/g, '')
  
  // Format based on length and pattern
  if (cleaned.startsWith('+62')) {
    // Indonesian format: +62 812-3456-7890
    const digits = cleaned.slice(3)
    if (digits.length >= 9) {
      return `+62 ${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
    }
  }
  
  return cleaned
}

// Validate phone number
export const validatePhoneNumber = (number) => {
  if (!number) return { isValid: false, message: 'Phone number is required' }
  
  const phoneRegex = /^\+[1-9]\d{1,14}$/
  
  if (!phoneRegex.test(number)) {
    return {
      isValid: false,
      message: 'Please enter a valid international phone number'
    }
  }
  
  return { isValid: true, message: 'Valid phone number' }
}

// Normalize phone number
export const normalizePhoneNumber = (number) => {
  if (!number) return ''
  
  let cleaned = number.replace(/[^\d+]/g, '')
  
  // Handle Indonesian numbers
  if (cleaned.startsWith('08')) {
    cleaned = '+62' + cleaned.slice(1)
  } else if (cleaned.startsWith('8') && !cleaned.startsWith('+')) {
    cleaned = '+62' + cleaned
  } else if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned
  }
  
  return cleaned
}
```

### Form Utilities
```javascript
// Form validation
export const validateForm = (data, rules) => {
  const errors = {}
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field]
    const value = data[field]
    
    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = `${field} is required`
    }
    
    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`
    }
    
    if (rule.pattern && value && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${field} format is invalid`
    }
  })
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return { success: true, message: 'Copied to clipboard!' }
  } catch (err) {
    return { success: false, message: 'Failed to copy to clipboard' }
  }
}
```

---

## 🧪 Testing

### Component Testing
```jsx
// Example test for PhoneNumberForm
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PhoneNumberForm from './PhoneNumberForm'

describe('PhoneNumberForm', () => {
  const mockCategories = [
    { id: 1, name: 'VIP' },
    { id: 2, name: 'Regular' }
  ]

  test('renders form elements', () => {
    render(<PhoneNumberForm categories={mockCategories} />)
    
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add number/i })).toBeInTheDocument()
  })

  test('validates phone number input', async () => {
    const mockOnSubmit = jest.fn()
    render(<PhoneNumberForm categories={mockCategories} onSubmit={mockOnSubmit} />)
    
    const phoneInput = screen.getByLabelText(/phone number/i)
    const submitButton = screen.getByRole('button', { name: /add number/i })
    
    fireEvent.change(phoneInput, { target: { value: 'invalid' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/invalid phone number/i)).toBeInTheDocument()
    })
    
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })
})
```

### API Testing
```javascript
// Mock API responses
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  rest.get('/api/phone-numbers', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: [
          {
            id: 1,
            original_number: '+6281234567890',
            normalized_number: '+6281234567890',
            category: { id: 1, name: 'VIP' }
          }
        ]
      })
    )
  }),
  
  rest.post('/api/phone-numbers', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: { id: 2, ...req.body },
        message: 'Phone number added successfully'
      })
    )
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

---

## 🚀 Performance Optimization

### Code Splitting
```jsx
// Lazy loading components
import { lazy, Suspense } from 'react'

const HomePage = lazy(() => import('./pages/HomePage'))
const PhoneNumbersPage = lazy(() => import('./pages/PhoneNumbersPage'))
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'))

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/phone-numbers" element={<PhoneNumbersPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
        </Routes>
      </Suspense>
    </Router>
  )
}
```

### Memoization
```jsx
import { memo, useMemo, useCallback } from 'react'

// Memoized component
const PhoneNumberItem = memo(({ number, onDelete, onEdit }) => {
  return (
    <div className="phone-number-item">
      <span>{number.original_number}</span>
      <button onClick={() => onDelete(number.id)}>Delete</button>
      <button onClick={() => onEdit(number)}>Edit</button>
    </div>
  )
})

// Memoized calculations
const ExpensiveComponent = ({ items, filter }) => {
  const filteredItems = useMemo(() => {
    return items.filter(item => item.name.includes(filter))
  }, [items, filter])

  const handleClick = useCallback((id) => {
    // Handle click
  }, [])

  return (
    <div>
      {filteredItems.map(item => (
        <div key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  )
}
```

### Virtual Scrolling
```jsx
// For large lists
import { FixedSizeList as List } from 'react-window'

const VirtualizedList = ({ items }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <PhoneNumberItem number={items[index]} />
    </div>
  )

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={60}
    >
      {Row}
    </List>
  )
}
```

---

## 🔧 Build & Deployment

### Development Build
```bash
# Start development server
npm run dev

# Development server runs on http://localhost:5173
# Hot module replacement enabled
# Source maps included
```

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Build output goes to dist/ folder
```

### Environment Variables
```bash
# .env.development
VITE_API_URL=http://localhost:3000
VITE_DEBUG=true

# .env.production
VITE_API_URL=https://api.yourdomain.com
VITE_DEBUG=false
```

### Deployment Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          api: ['axios'],
          icons: ['lucide-react']
        }
      }
    }
  }
})
```

---

## 📱 PWA Features (Future)

### Service Worker
```javascript
// public/sw.js
const CACHE_NAME = 'whatsapp-manager-v1'
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response
        }
        return fetch(event.request)
      })
  )
})
```

### Web App Manifest
```json
{
  "name": "WhatsApp Numbers Manager",
  "short_name": "WA Manager",
  "description": "Manage WhatsApp phone numbers with ease",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f0f23",
  "theme_color": "#667eea",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

This documentation covers all aspects of the frontend application. For backend documentation, refer to the API documentation and database setup guides.