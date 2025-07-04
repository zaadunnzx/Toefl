# WhatsApp Numbers Management System

A full-stack web application for managing WhatsApp phone numbers with dynamic categorization, built with Node.js, Express, PostgreSQL, and React.

## Features

- **Phone Number Management**: Store and organize WhatsApp numbers with validation and normalization
- **Duplicate Detection**: Automatically detect and prevent duplicate phone numbers
- **Category System**: Organize numbers into dynamic categories
- **Bulk Import**: Import multiple phone numbers at once
- **International Support**: Support for various international phone number formats
- **Real-time Validation**: Live validation and duplicate checking
- **Responsive Design**: Modern UI with Festiva-inspired theme

## Technology Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **Sequelize** ORM
- **CORS** for cross-origin requests
- **dotenv** for environment variables

### Frontend
- **React 18** with Vite
- **React Router** for routing
- **Axios** for API calls
- **Lucide React** for icons
- **CSS3** with custom properties

## Installation

### Prerequisites
- Node.js 16+ 
- PostgreSQL 12+
- npm or yarn

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd whatsapp-numbers-management
```

2. Install backend dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=whatsapp_numbers
DB_USER=your_username
DB_PASSWORD=your_password

# Server Configuration
PORT=3000
NODE_ENV=development
```

4. Create the PostgreSQL database:
```sql
CREATE DATABASE whatsapp_numbers;
```

5. Start the backend server:
```bash
npm start
```

The backend will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
VITE_API_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

### Phone Numbers
- `GET /api/phone-numbers` - Get all phone numbers
- `POST /api/phone-numbers` - Create a new phone number
- `POST /api/phone-numbers/bulk` - Bulk import phone numbers
- `POST /api/phone-numbers/check` - Check if number exists
- `DELETE /api/phone-numbers/:id` - Delete a phone number

### Health Check
- `GET /api/health` - Health check endpoint

## Usage

### Adding Phone Numbers

1. **Single Number**: Click "Add Number" button and fill in the form
2. **Bulk Import**: Click "Bulk Import" button and paste multiple numbers

### Phone Number Formats Supported

- International format: `+6281234567890`
- Indonesian format: `08123456789`
- Without country code: `81234567890`

The system automatically normalizes numbers to international format.

### Managing Categories

1. Go to the Categories page
2. Click "Add Category" to create new categories
3. Use the search bar to find specific categories
4. Edit or delete categories as needed

### Duplicate Detection

The system automatically:
- Normalizes phone numbers to a standard format
- Checks for duplicates in real-time
- Prevents duplicate entries
- Shows duplicate warnings during import

## Database Schema

### Categories Table
```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Phone Numbers Table
```sql
CREATE TABLE phone_numbers (
    id SERIAL PRIMARY KEY,
    original_number VARCHAR(50) NOT NULL,
    normalized_number VARCHAR(20) NOT NULL UNIQUE,
    category_id INTEGER REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## Development

### Running Tests
```bash
# Backend tests
npm test

# Frontend tests
cd frontend && npm test
```

### Building for Production
```bash
# Build frontend
cd frontend && npm run build

# Start production server
npm run production
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email your-email@example.com or create an issue in the repository.
