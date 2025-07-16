# 🧪 Testing Guide

## Overview
This guide covers comprehensive testing strategies for the WhatsApp Numbers Management System, including unit tests, integration tests, API tests, and end-to-end testing.

## 🧩 Testing Strategy

### Testing Pyramid
```
    E2E Tests (Few)
   ────────────────
  Integration Tests (Some)
 ──────────────────────────
Unit Tests (Many)
```

### Test Categories
1. **Unit Tests** - Individual functions and components
2. **Integration Tests** - API endpoints and database interactions
3. **End-to-End Tests** - Complete user workflows
4. **Performance Tests** - Load and stress testing
5. **Security Tests** - Vulnerability assessment

---

## 🔧 Backend Testing

### Setup Test Environment
```javascript
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:integration": "jest --testPathPattern=integration"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "supertest": "^6.3.0",
    "@jest/globals": "^29.0.0"
  }
}
```

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'utils/**/*.js',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

### Test Setup
```javascript
// tests/setup.js
const { sequelize } = require('../config/database')

beforeAll(async () => {
  // Setup test database
  await sequelize.sync({ force: true })
})

afterAll(async () => {
  // Clean up
  await sequelize.close()
})

beforeEach(async () => {
  // Clear data between tests
  await sequelize.truncate({ cascade: true })
})
```

---

## 🧪 Unit Tests

### Model Tests
```javascript
// tests/models/Category.test.js
const { Category } = require('../../models')

describe('Category Model', () => {
  test('should create a category with valid data', async () => {
    const categoryData = {
      name: 'Test Category',
      description: 'Test description'
    }
    
    const category = await Category.create(categoryData)
    
    expect(category.id).toBeDefined()
    expect(category.name).toBe(categoryData.name)
    expect(category.description).toBe(categoryData.description)
    expect(category.created_at).toBeDefined()
  })

  test('should not create category without name', async () => {
    const categoryData = {
      description: 'Test description'
    }
    
    await expect(Category.create(categoryData))
      .rejects
      .toThrow('Category name cannot be empty')
  })

  test('should not create duplicate category names', async () => {
    const categoryData = {
      name: 'Duplicate Name',
      description: 'Test description'
    }
    
    await Category.create(categoryData)
    
    await expect(Category.create(categoryData))
      .rejects
      .toThrow('Category name already exists')
  })
})
```

### Utility Function Tests
```javascript
// tests/utils/phoneUtils.test.js
const { validatePhoneNumber, normalizePhoneNumber } = require('../../utils/phoneUtils')

describe('Phone Utils', () => {
  describe('validatePhoneNumber', () => {
    test('should validate Indonesian numbers', () => {
      const tests = [
        { input: '08123456789', expected: true },
        { input: '+6281234567890', expected: true },
        { input: '81234567890', expected: true }
      ]
      
      tests.forEach(({ input, expected }) => {
        const result = validatePhoneNumber(input)
        expect(result.isValid).toBe(expected)
      })
    })

    test('should reject invalid numbers', () => {
      const invalidNumbers = [
        '',
        '123',
        'abc',
        '+',
        '08123',
        '+621234567890123456789' // too long
      ]
      
      invalidNumbers.forEach(number => {
        const result = validatePhoneNumber(number)
        expect(result.isValid).toBe(false)
        expect(result.message).toBeDefined()
      })
    })
  })

  describe('normalizePhoneNumber', () => {
    test('should normalize Indonesian numbers', () => {
      const tests = [
        { input: '08123456789', expected: '+6281234567890' },
        { input: '8123456789', expected: '+6281234567890' },
        { input: '+62 812-3456-7890', expected: '+6281234567890' },
        { input: '+62 812 3456 7890', expected: '+6281234567890' }
      ]
      
      tests.forEach(({ input, expected }) => {
        const result = normalizePhoneNumber(input)
        expect(result).toBe(expected)
      })
    })
  })
})
```

---

## 🔌 Integration Tests

### API Endpoint Tests
```javascript
// tests/integration/categories.test.js
const request = require('supertest')
const app = require('../../server')
const { Category } = require('../../models')

describe('Categories API', () => {
  describe('GET /api/categories', () => {
    test('should return empty array when no categories', async () => {
      const response = await request(app)
        .get('/api/categories')
        .expect(200)
      
      expect(response.body.success).toBe(true)
      expect(response.body.data).toEqual([])
    })

    test('should return all categories', async () => {
      // Create test data
      await Category.bulkCreate([
        { name: 'VIP', description: 'VIP customers' },
        { name: 'Regular', description: 'Regular customers' }
      ])
      
      const response = await request(app)
        .get('/api/categories')
        .expect(200)
      
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(2)
      expect(response.body.data[0].name).toBe('Regular') // ordered by created_at DESC
    })
  })

  describe('POST /api/categories', () => {
    test('should create new category', async () => {
      const categoryData = {
        name: 'New Category',
        description: 'New description'
      }
      
      const response = await request(app)
        .post('/api/categories')
        .send(categoryData)
        .expect(201)
      
      expect(response.body.success).toBe(true)
      expect(response.body.data.name).toBe(categoryData.name)
      expect(response.body.data.description).toBe(categoryData.description)
      
      // Verify in database
      const category = await Category.findByPk(response.body.data.id)
      expect(category).toBeTruthy()
    })

    test('should return 400 for invalid data', async () => {
      const response = await request(app)
        .post('/api/categories')
        .send({ description: 'No name' })
        .expect(400)
      
      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('name is required')
    })

    test('should return 400 for duplicate name', async () => {
      const categoryData = { name: 'Duplicate', description: 'Test' }
      
      await Category.create(categoryData)
      
      const response = await request(app)
        .post('/api/categories')
        .send(categoryData)
        .expect(400)
      
      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('already exists')
    })
  })
})
```

### Phone Numbers API Tests
```javascript
// tests/integration/phoneNumbers.test.js
const request = require('supertest')
const app = require('../../server')
const { Category, PhoneNumber } = require('../../models')

describe('Phone Numbers API', () => {
  let testCategory

  beforeEach(async () => {
    testCategory = await Category.create({
      name: 'Test Category',
      description: 'For testing'
    })
  })

  describe('POST /api/phone-numbers', () => {
    test('should add valid phone number', async () => {
      const numberData = {
        original_number: '+6281234567890',
        category_id: testCategory.id
      }
      
      const response = await request(app)
        .post('/api/phone-numbers')
        .send(numberData)
        .expect(201)
      
      expect(response.body.success).toBe(true)
      expect(response.body.data.original_number).toBe(numberData.original_number)
      expect(response.body.data.normalized_number).toBe('+6281234567890')
      expect(response.body.data.category.id).toBe(testCategory.id)
    })

    test('should normalize Indonesian number', async () => {
      const numberData = {
        original_number: '08123456789',
        category_id: testCategory.id
      }
      
      const response = await request(app)
        .post('/api/phone-numbers')
        .send(numberData)
        .expect(201)
      
      expect(response.body.data.normalized_number).toBe('+6281234567890')
    })

    test('should reject duplicate numbers', async () => {
      const numberData = {
        original_number: '+6281234567890',
        category_id: testCategory.id
      }
      
      // Create first number
      await PhoneNumber.create({
        original_number: numberData.original_number,
        normalized_number: '+6281234567890',
        category_id: testCategory.id
      })
      
      // Try to create duplicate
      const response = await request(app)
        .post('/api/phone-numbers')
        .send(numberData)
        .expect(400)
      
      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('already exists')
    })

    test('should reject invalid phone number', async () => {
      const numberData = {
        original_number: 'invalid',
        category_id: testCategory.id
      }
      
      const response = await request(app)
        .post('/api/phone-numbers')
        .send(numberData)
        .expect(400)
      
      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Invalid')
    })

    test('should reject invalid category', async () => {
      const numberData = {
        original_number: '+6281234567890',
        category_id: 999
      }
      
      const response = await request(app)
        .post('/api/phone-numbers')
        .send(numberData)
        .expect(400)
      
      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('Category not found')
    })
  })

  describe('POST /api/phone-numbers/bulk', () => {
    test('should import multiple valid numbers', async () => {
      const bulkData = {
        numbers: [
          { original_number: '+6281234567891', category_id: testCategory.id },
          { original_number: '08123456789', category_id: testCategory.id },
          { original_number: '81234567890', category_id: testCategory.id }
        ]
      }
      
      const response = await request(app)
        .post('/api/phone-numbers/bulk')
        .send(bulkData)
        .expect(201)
      
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(3)
      expect(response.body.errors).toHaveLength(0)
    })

    test('should handle mixed valid and invalid numbers', async () => {
      const bulkData = {
        numbers: [
          { original_number: '+6281234567891', category_id: testCategory.id },
          { original_number: 'invalid', category_id: testCategory.id },
          { original_number: '08123456789', category_id: testCategory.id }
        ]
      }
      
      const response = await request(app)
        .post('/api/phone-numbers/bulk')
        .send(bulkData)
        .expect(201)
      
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(2)
      expect(response.body.errors).toHaveLength(1)
      expect(response.body.errors[0].index).toBe(1)
    })
  })

  describe('POST /api/phone-numbers/check', () => {
    test('should detect existing number', async () => {
      await PhoneNumber.create({
        original_number: '+6281234567890',
        normalized_number: '+6281234567890',
        category_id: testCategory.id
      })
      
      const response = await request(app)
        .post('/api/phone-numbers/check')
        .send({ number: '08123456789' }) // Different format, same normalized
        .expect(200)
      
      expect(response.body.success).toBe(true)
      expect(response.body.exists).toBe(true)
      expect(response.body.isValid).toBe(true)
      expect(response.body.existingNumber).toBeDefined()
    })

    test('should detect non-existing number', async () => {
      const response = await request(app)
        .post('/api/phone-numbers/check')
        .send({ number: '+6281234567890' })
        .expect(200)
      
      expect(response.body.success).toBe(true)
      expect(response.body.exists).toBe(false)
      expect(response.body.isValid).toBe(true)
      expect(response.body.normalized_number).toBe('+6281234567890')
    })

    test('should detect invalid number', async () => {
      const response = await request(app)
        .post('/api/phone-numbers/check')
        .send({ number: 'invalid' })
        .expect(200)
      
      expect(response.body.success).toBe(true)
      expect(response.body.exists).toBe(false)
      expect(response.body.isValid).toBe(false)
    })
  })
})
```

---

## 🖥️ Frontend Testing

### Setup Frontend Testing
```json
// frontend/package.json
{
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/user-event": "^14.4.3",
    "jsdom": "^20.0.3",
    "vitest": "^0.24.0"
  },
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

### Vitest Configuration
```javascript
// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.js',
    coverage: {
      reporter: ['text', 'json', 'html']
    }
  }
})
```

### Test Setup
```javascript
// frontend/src/test-setup.js
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock environment variables
vi.mock('./services/api', () => ({
  categoriesAPI: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  },
  phoneNumbersAPI: {
    getAll: vi.fn(),
    create: vi.fn(),
    createBulk: vi.fn(),
    checkDuplicate: vi.fn(),
    delete: vi.fn()
  }
}))
```

### Component Tests
```javascript
// frontend/src/components/__tests__/Navbar.test.jsx
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from '../Navbar'

const NavbarWithRouter = () => (
  <BrowserRouter>
    <Navbar />
  </BrowserRouter>
)

describe('Navbar', () => {
  test('renders navigation links', () => {
    render(<NavbarWithRouter />)
    
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Phone Numbers')).toBeInTheDocument()
    expect(screen.getByText('Categories')).toBeInTheDocument()
  })

  test('highlights active link', () => {
    render(<NavbarWithRouter />)
    
    const homeLink = screen.getByText('Home').closest('a')
    expect(homeLink).toHaveClass('active')
  })
})
```

### Form Component Tests
```javascript
// frontend/src/components/__tests__/PhoneNumberForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PhoneNumberForm from '../PhoneNumberForm'

const mockCategories = [
  { id: 1, name: 'VIP' },
  { id: 2, name: 'Regular' }
]

describe('PhoneNumberForm', () => {
  test('renders form elements', () => {
    render(<PhoneNumberForm categories={mockCategories} />)
    
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add number/i })).toBeInTheDocument()
  })

  test('validates required fields', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn()
    
    render(
      <PhoneNumberForm 
        categories={mockCategories} 
        onSubmit={mockOnSubmit} 
      />
    )
    
    const submitButton = screen.getByRole('button', { name: /add number/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument()
    })
    
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  test('submits valid form data', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn()
    
    render(
      <PhoneNumberForm 
        categories={mockCategories} 
        onSubmit={mockOnSubmit} 
      />
    )
    
    const phoneInput = screen.getByLabelText(/phone number/i)
    const categorySelect = screen.getByLabelText(/category/i)
    const submitButton = screen.getByRole('button', { name: /add number/i })
    
    await user.type(phoneInput, '+6281234567890')
    await user.selectOptions(categorySelect, '1')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        original_number: '+6281234567890',
        category_id: 1
      })
    })
  })

  test('validates phone number format', async () => {
    const user = userEvent.setup()
    
    render(<PhoneNumberForm categories={mockCategories} />)
    
    const phoneInput = screen.getByLabelText(/phone number/i)
    await user.type(phoneInput, 'invalid')
    await user.tab() // Trigger blur event
    
    await waitFor(() => {
      expect(screen.getByText(/invalid phone number format/i)).toBeInTheDocument()
    })
  })
})
```

### Page Component Tests
```javascript
// frontend/src/pages/__tests__/PhoneNumbersPage.test.jsx
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import PhoneNumbersPage from '../PhoneNumbersPage'
import { phoneNumbersAPI, categoriesAPI } from '../../services/api'

vi.mock('../../services/api')

const PhoneNumbersPageWithRouter = () => (
  <BrowserRouter>
    <PhoneNumbersPage />
  </BrowserRouter>
)

describe('PhoneNumbersPage', () => {
  beforeEach(() => {
    categoriesAPI.getAll.mockResolvedValue({
      data: {
        success: true,
        data: [
          { id: 1, name: 'VIP' },
          { id: 2, name: 'Regular' }
        ]
      }
    })
    
    phoneNumbersAPI.getAll.mockResolvedValue({
      data: {
        success: true,
        data: [
          {
            id: 1,
            original_number: '+6281234567890',
            normalized_number: '+6281234567890',
            category: { id: 1, name: 'VIP' }
          }
        ]
      }
    })
  })

  test('loads and displays phone numbers', async () => {
    render(<PhoneNumbersPageWithRouter />)
    
    await waitFor(() => {
      expect(screen.getByText('+6281234567890')).toBeInTheDocument()
      expect(screen.getByText('VIP')).toBeInTheDocument()
    })
  })

  test('displays loading state', () => {
    render(<PhoneNumbersPageWithRouter />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  test('handles API errors', async () => {
    phoneNumbersAPI.getAll.mockRejectedValue(new Error('API Error'))
    
    render(<PhoneNumbersPageWithRouter />)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
    })
  })
})
```

---

## 🔄 End-to-End Tests

### Cypress Setup
```json
// frontend/package.json
{
  "devDependencies": {
    "cypress": "^12.0.0"
  },
  "scripts": {
    "cy:open": "cypress open",
    "cy:run": "cypress run"
  }
}
```

### Cypress Configuration
```javascript
// frontend/cypress.config.js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
```

### E2E Test Examples
```javascript
// frontend/cypress/e2e/phone-numbers.cy.js
describe('Phone Numbers Management', () => {
  beforeEach(() => {
    // Setup test data
    cy.task('resetDb')
    cy.task('seedDb')
    cy.visit('/phone-numbers')
  })

  it('should add a new phone number', () => {
    cy.get('[data-testid="add-number-btn"]').click()
    
    cy.get('[data-testid="phone-input"]')
      .type('+6281234567890')
    
    cy.get('[data-testid="category-select"]')
      .select('VIP')
    
    cy.get('[data-testid="submit-btn"]').click()
    
    cy.get('[data-testid="success-message"]')
      .should('contain', 'Phone number added successfully')
    
    cy.get('[data-testid="phone-list"]')
      .should('contain', '+6281234567890')
  })

  it('should detect duplicate numbers', () => {
    // Add a number first
    cy.get('[data-testid="add-number-btn"]').click()
    cy.get('[data-testid="phone-input"]').type('+6281234567890')
    cy.get('[data-testid="category-select"]').select('VIP')
    cy.get('[data-testid="submit-btn"]').click()
    
    // Try to add the same number
    cy.get('[data-testid="add-number-btn"]').click()
    cy.get('[data-testid="phone-input"]').type('08123456789') // Different format, same number
    cy.get('[data-testid="category-select"]').select('Regular')
    
    cy.get('[data-testid="duplicate-warning"]')
      .should('be.visible')
      .and('contain', 'This number already exists')
  })

  it('should bulk import phone numbers', () => {
    cy.get('[data-testid="bulk-import-btn"]').click()
    
    cy.get('[data-testid="category-select"]').select('VIP')
    
    const numbers = `
      +6281234567891
      08123456789
      81234567890
    `
    
    cy.get('[data-testid="numbers-textarea"]').type(numbers)
    
    cy.get('[data-testid="import-btn"]').click()
    
    cy.get('[data-testid="import-results"]')
      .should('contain', '3 numbers imported successfully')
    
    cy.get('[data-testid="phone-list"]')
      .should('contain', '+6281234567891')
      .and('contain', '+6281234567890')
  })

  it('should search phone numbers', () => {
    // Add test data first
    cy.task('seedPhoneNumbers')
    cy.visit('/phone-numbers')
    
    cy.get('[data-testid="search-input"]')
      .type('812345')
    
    cy.get('[data-testid="phone-list"] [data-testid="phone-item"]')
      .should('have.length.greaterThan', 0)
      .each($el => {
        cy.wrap($el).should('contain', '812345')
      })
  })

  it('should filter by category', () => {
    cy.task('seedPhoneNumbers')
    cy.visit('/phone-numbers')
    
    cy.get('[data-testid="category-filter"]').select('VIP')
    
    cy.get('[data-testid="phone-list"] [data-testid="phone-item"]')
      .should('have.length.greaterThan', 0)
      .each($el => {
        cy.wrap($el).find('[data-testid="category-badge"]')
          .should('contain', 'VIP')
      })
  })

  it('should delete phone number', () => {
    cy.task('seedPhoneNumbers')
    cy.visit('/phone-numbers')
    
    cy.get('[data-testid="phone-item"]').first().within(() => {
      cy.get('[data-testid="delete-btn"]').click()
    })
    
    cy.get('[data-testid="confirm-delete"]').click()
    
    cy.get('[data-testid="success-message"]')
      .should('contain', 'Phone number deleted successfully')
  })
})
```

### Cypress Commands
```javascript
// frontend/cypress/support/commands.js
Cypress.Commands.add('resetDb', () => {
  cy.request('POST', '/api/test/reset-db')
})

Cypress.Commands.add('seedDb', () => {
  cy.request('POST', '/api/test/seed-db')
})

Cypress.Commands.add('seedPhoneNumbers', () => {
  cy.request('POST', '/api/test/seed-phone-numbers')
})

Cypress.Commands.add('login', (username, password) => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: { username, password }
  }).then((response) => {
    window.localStorage.setItem('token', response.body.token)
  })
})
```

---

## 📊 Performance Testing

### Load Testing with Artillery
```yaml
# load-test.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 20
    - duration: 60
      arrivalRate: 50

scenarios:
  - name: "API Load Test"
    weight: 100
    flow:
      - get:
          url: "/api/health"
      - get:
          url: "/api/categories"
      - post:
          url: "/api/phone-numbers"
          json:
            original_number: "{{ $randomPhoneNumber() }}"
            category_id: 1
      - get:
          url: "/api/phone-numbers"
```

```bash
# Run load test
npm install -g artillery
artillery run load-test.yml
```

### Database Performance Testing
```javascript
// tests/performance/database.test.js
const { PhoneNumber, Category } = require('../../models')

describe('Database Performance', () => {
  test('should handle bulk insert efficiently', async () => {
    const category = await Category.create({
      name: 'Performance Test',
      description: 'For performance testing'
    })
    
    const startTime = Date.now()
    
    const phoneNumbers = Array.from({ length: 1000 }, (_, i) => ({
      original_number: `+62812345${String(i).padStart(5, '0')}`,
      normalized_number: `+62812345${String(i).padStart(5, '0')}`,
      category_id: category.id
    }))
    
    await PhoneNumber.bulkCreate(phoneNumbers)
    
    const endTime = Date.now()
    const duration = endTime - startTime
    
    expect(duration).toBeLessThan(5000) // Should complete in less than 5 seconds
    
    const count = await PhoneNumber.count()
    expect(count).toBe(1000)
  })

  test('should query large dataset efficiently', async () => {
    // Setup large dataset
    const category = await Category.create({
      name: 'Query Test',
      description: 'For query testing'
    })
    
    const phoneNumbers = Array.from({ length: 10000 }, (_, i) => ({
      original_number: `+62812345${String(i).padStart(6, '0')}`,
      normalized_number: `+62812345${String(i).padStart(6, '0')}`,
      category_id: category.id
    }))
    
    await PhoneNumber.bulkCreate(phoneNumbers)
    
    const startTime = Date.now()
    
    const results = await PhoneNumber.findAll({
      include: [{
        model: Category,
        as: 'category'
      }],
      limit: 50,
      offset: 0,
      order: [['created_at', 'DESC']]
    })
    
    const endTime = Date.now()
    const duration = endTime - startTime
    
    expect(duration).toBeLessThan(1000) // Should complete in less than 1 second
    expect(results).toHaveLength(50)
  })
})
```

---

## 🛡️ Security Testing

### Input Validation Tests
```javascript
// tests/security/input-validation.test.js
const request = require('supertest')
const app = require('../../server')

describe('Security - Input Validation', () => {
  test('should reject SQL injection attempts', async () => {
    const maliciousInputs = [
      "'; DROP TABLE categories; --",
      "1' OR '1'='1",
      "' UNION SELECT * FROM categories --"
    ]
    
    for (const input of maliciousInputs) {
      const response = await request(app)
        .post('/api/categories')
        .send({ name: input, description: 'test' })
      
      expect(response.status).toBe(400)
    }
  })

  test('should reject XSS attempts', async () => {
    const xssPayloads = [
      "<script>alert('xss')</script>",
      "javascript:alert('xss')",
      "<img src=x onerror=alert('xss')>"
    ]
    
    for (const payload of xssPayloads) {
      const response = await request(app)
        .post('/api/categories')
        .send({ name: payload, description: 'test' })
      
      expect(response.status).toBe(400)
    }
  })

  test('should handle large payloads', async () => {
    const largeString = 'a'.repeat(10000)
    
    const response = await request(app)
      .post('/api/categories')
      .send({ name: largeString, description: 'test' })
    
    expect(response.status).toBe(400)
  })

  test('should validate phone number format strictly', async () => {
    const invalidFormats = [
      "javascript:alert('xss')",
      "<script>alert('xss')</script>",
      "'; DROP TABLE phone_numbers; --",
      "../../../etc/passwd"
    ]
    
    for (const format of invalidFormats) {
      const response = await request(app)
        .post('/api/phone-numbers')
        .send({ original_number: format, category_id: 1 })
      
      expect(response.status).toBe(400)
    }
  })
})
```

### Rate Limiting Tests
```javascript
// tests/security/rate-limiting.test.js
const request = require('supertest')
const app = require('../../server')

describe('Security - Rate Limiting', () => {
  test('should enforce rate limits', async () => {
    const requests = Array.from({ length: 150 }, () => 
      request(app).get('/api/health')
    )
    
    const responses = await Promise.all(requests)
    const tooManyRequests = responses.filter(res => res.status === 429)
    
    expect(tooManyRequests.length).toBeGreaterThan(0)
  })
})
```

---

## 📊 Test Coverage

### Generating Coverage Reports
```bash
# Backend coverage
npm run test:coverage

# Frontend coverage
cd frontend
npm run test:coverage
```

### Coverage Configuration
```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'utils/**/*.js',
    '!**/node_modules/**',
    '!**/tests/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './controllers/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  coverageReporters: ['text', 'lcov', 'html']
}
```

---

## 🚀 Continuous Integration

### GitHub Actions Test Workflow
```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: test_password
          POSTGRES_DB: wa_db_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:coverage
        env:
          NODE_ENV: test
          DB_HOST: localhost
          DB_PORT: 5432
          DB_NAME: wa_db_test
          DB_USER: postgres
          DB_PASSWORD: test_password
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3

  frontend-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Run tests
        run: |
          cd frontend
          npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          directory: ./frontend/coverage

  e2e-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: test_password
          POSTGRES_DB: wa_db_test
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
      
      - name: Install backend dependencies
        run: npm ci
      
      - name: Install frontend dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Start backend
        run: |
          npm start &
          sleep 10
        env:
          NODE_ENV: test
          DB_HOST: localhost
          DB_PORT: 5432
          DB_NAME: wa_db_test
          DB_USER: postgres
          DB_PASSWORD: test_password
      
      - name: Start frontend
        run: |
          cd frontend
          npm run dev &
          sleep 10
      
      - name: Run Cypress tests
        run: |
          cd frontend
          npx cypress run
        env:
          CYPRESS_baseUrl: http://localhost:5173
```

---

## 📝 Test Documentation

### Writing Good Tests

#### Test Structure (AAA Pattern)
```javascript
test('should validate phone number format', () => {
  // Arrange
  const phoneNumber = '+6281234567890'
  
  // Act
  const result = validatePhoneNumber(phoneNumber)
  
  // Assert
  expect(result.isValid).toBe(true)
  expect(result.normalized).toBe('+6281234567890')
})
```

#### Test Naming Convention
- Use descriptive test names
- Start with "should"
- Describe the expected behavior
- Include the context when necessary

```javascript
// Good
test('should normalize Indonesian phone number from 08 format to +62')
test('should return 400 when category name is missing')
test('should detect duplicate phone numbers across different formats')

// Bad
test('test phone validation')
test('category creation')
test('duplicate check')
```

#### Test Data Management
```javascript
// Create test factories
const createTestCategory = (overrides = {}) => ({
  name: 'Test Category',
  description: 'Test description',
  ...overrides
})

const createTestPhoneNumber = (categoryId, overrides = {}) => ({
  original_number: '+6281234567890',
  category_id: categoryId,
  ...overrides
})
```

---

This comprehensive testing guide ensures the reliability and quality of the WhatsApp Numbers Management System through thorough testing at all levels.