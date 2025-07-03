# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Node.js Express backend system for managing WhatsApp phone numbers with dynamic categorization. The system uses PostgreSQL database and Sequelize ORM.

## Key Features
- Store WhatsApp numbers with validation and normalization
- Detect duplicate numbers automatically
- Dynamic category management
- REST API with CRUD operations
- Support for international phone number formats

## Code Guidelines
- Use async/await for asynchronous operations
- Implement proper error handling with try-catch blocks
- Follow RESTful API conventions
- Use Sequelize ORM for database operations
- Normalize phone numbers before storing
- Validate input data before processing
- Return consistent JSON response format with success/error status

## Database Schema
- Categories table: id, name, description, timestamps
- PhoneNumbers table: id, original_number, normalized_number, category_id, timestamps
- Relationships: Category hasMany PhoneNumbers, PhoneNumber belongsTo Category

## API Response Format
Always use this format for API responses:
```json
{
  "success": boolean,
  "data": object|array,
  "message": string,
  "error": string (optional)
}
```

## Phone Number Handling
- Normalize phone numbers by removing spaces, dashes, and formatting
- Support Indonesian numbers starting with 08 (convert to +62)
- Validate international format (+country_code + number)
- Store both original and normalized versions
