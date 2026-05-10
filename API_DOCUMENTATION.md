# Express Flashcard API Documentation

## Overview
A secure Express.js API for managing flashcards with user authentication, file uploads, and comprehensive error handling.

## Features
✅ User Authentication (JWT)
✅ CRUD Operations for Users & Flashcards
✅ Pagination Support
✅ File Upload/Download
✅ Data Validation
✅ Protected Routes
✅ Comprehensive Error Handling
✅ Jest Test Coverage

---

## Environment Setup

```bash
npm install
```

Create `.env` file:
```
JWT_SECRET=your-secure-secret-key-here
PORT=3000
MONGODB_URI=mongodb://localhost:27017/flashcards
```

Run development server:
```bash
npm run dev
```

Run tests:
```bash
npm test
```

---

## API Routes

### Authentication

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation:**
- Name: 2-100 characters
- Email: Valid format
- Password: Minimum 6 characters

**Responses:**
- `201` - User registered successfully
- `400` - Validation error
- `409` - Email already in use

---

#### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

Token expires in 7 days. Include in Authorization header:
```
Authorization: Bearer <token>
```

---

### Users

#### List All Users (Paginated)
```
GET /users?page=1&limit=10
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

**Response (200):**
```json
{
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

#### Get Single User
```
GET /users/:id
```

**Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

#### Update User (Protected)
```
PUT /users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "newpassword123"
}
```

**Validation:**
- Only provided fields are updated
- Email uniqueness checked (excluding current user)

**Response (200):**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

---

#### Delete User (Protected)
```
DELETE /users/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

---

### Flashcards

#### List User's Flashcards (Protected, Paginated)
```
GET /flashcards?page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response (200):**
```json
{
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "question": "What is the capital of France?",
      "answer": "Paris",
      "difficulty": "easy",
      "isReviewed": false,
      "createdAt": "2024-05-10T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

#### Get Single Flashcard (Protected)
```
GET /flashcards/:cardId
Authorization: Bearer <token>
```

**Response (200):** Same as list item

---

#### Create Flashcard (Protected)
```
POST /flashcards
Authorization: Bearer <token>
Content-Type: application/json

{
  "question": "What is the capital of France?",
  "answer": "Paris is the capital of France.",
  "difficulty": "easy"
}
```

**Validation:**
- Question: 5-1000 characters
- Answer: 5-5000 characters
- Difficulty: "easy", "medium", or "hard" (default: "medium")

**Response (201):**
```json
{
  "message": "Flashcard created successfully",
  "flashcard": {
    "id": "507f1f77bcf86cd799439012",
    "question": "What is the capital of France?",
    "answer": "Paris is the capital of France.",
    "difficulty": "easy",
    "isReviewed": false
  }
}
```

---

#### Update Flashcard (Protected)
```
PUT /flashcards/:cardId
Authorization: Bearer <token>
Content-Type: application/json

{
  "question": "Updated question?",
  "answer": "Updated answer",
  "difficulty": "medium",
  "isReviewed": true
}
```

**Response (200):**
```json
{
  "message": "Flashcard updated successfully",
  "flashcard": { ... }
}
```

---

#### Delete Flashcard (Protected)
```
DELETE /flashcards/:cardId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Flashcard deleted successfully"
}
```

---

### File Uploads

#### Upload File (Protected)
```
POST /upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary-file>
```

**Allowed Types:** JPEG, PNG, PDF, DOC, DOCX
**Max Size:** 10MB

**Response (201):**
```json
{
  "message": "File uploaded successfully",
  "file": {
    "filename": "file-1715334500-123456789.pdf",
    "originalName": "document.pdf",
    "mimeType": "application/pdf",
    "size": 102400,
    "path": "uploads/file-1715334500-123456789.pdf",
    "uploadedAt": "2024-05-10T10:00:00Z"
  }
}
```

---

#### Download File
```
GET /upload/:filename
```

Returns the file as attachment.

---

#### Delete File (Protected)
```
DELETE /upload/:filename
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "File deleted successfully"
}
```

---

## Error Handling

All errors return consistent JSON format:

```json
{
  "error": "Error message here"
}
```

Or for validation errors:

```json
{
  "errors": [
    "Field 1 validation error",
    "Field 2 validation error"
  ]
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation failed) |
| 401 | Unauthorized (login required) |
| 403 | Forbidden (access denied) |
| 404 | Not Found |
| 409 | Conflict (email already exists) |
| 500 | Server Error |

---

## Authentication

All protected routes require JWT token in header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token is valid for 7 days.

---

## Data Models

### User
```typescript
{
  id: ObjectId
  name: string (2-100 chars)
  email: string (unique)
  password: string (hashed with bcrypt)
  createdAt: Date
  updatedAt: Date
}
```

### Flashcard
```typescript
{
  id: ObjectId
  userId: ObjectId (reference to User)
  question: string (5-1000 chars)
  answer: string (5-5000 chars)
  difficulty: enum ("easy" | "medium" | "hard")
  isReviewed: boolean (default: false)
  createdAt: Date
  updatedAt: Date
}
```

---

## Testing

Run tests with coverage:

```bash
npm test -- --coverage
```

Test files located in `/tests` directory:
- `tests/controllers/auth.test.ts` - Authentication tests
- `tests/utils/validators.test.ts` - Validation tests
- `tests/utils/pagination.test.ts` - Pagination tests

---

## Security Features

✅ JWT token authentication
✅ Bcrypt password hashing
✅ Input validation & sanitization
✅ ObjectId validation
✅ Authorization checks (user ownership)
✅ CORS enabled
✅ File upload validation
✅ Directory traversal attack prevention
✅ Error handling (no sensitive data leaked)

---

## Project Structure

```
├── controllers/         # Route handlers
├── models/             # MongoDB schemas
├── routes/             # Express route definitions
├── middleware/         # Auth & upload middleware
├── utils/              # Validators, pagination helpers
├── tests/              # Jest test files
├── uploads/            # User uploaded files
├── index.ts            # Server entry point
├── mongoose.ts         # DB connection
└── .env               # Environment variables
```

---

## Development Notes

- All responses use JSON format
- Timestamps in ISO 8601 format
- Pagination starts at page 1
- Delete operations are permanent
- Email updates check uniqueness against all users except current user
