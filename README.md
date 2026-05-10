# Express Flashcard API

A production-ready Express.js backend API for managing flashcards with comprehensive authentication, validation, pagination, and file upload capabilities.

## ✅ Features Implemented

- ✅ **CRUD Operations** - Read, Create, Update, Delete for Users & Flashcards
- ✅ **JWT Authentication** - Secure token-based authentication (7-day expiration)
- ✅ **Protected Routes** - Authorization middleware prevents unauthorized access
- ✅ **Pagination** - Configurable page/limit with metadata (hasNext, hasPrev)
- ✅ **Data Validation** - Comprehensive validators for all input data
- ✅ **File Uploads** - Multer integration with file type/size restrictions
- ✅ **Error Handling** - Consistent error responses with validation details
- ✅ **Relational Data** - MongoDB references between Users and Flashcards
- ✅ **Jest Testing** - Test suite covering routes, validators, and pagination
- ✅ **API Documentation** - Complete route documentation with examples
- ✅ **Middleware** - Auth middleware, CORS, file uploads
- ✅ **User Accounts** - Register, login, user management

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Fill in your environment variables
# JWT_SECRET=your-secret-key
# PORT=3000
```

### Running the Server

```bash
# Development mode (auto-reload)
npm run dev

# Production build
npm run build
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode for tests
npm run test:watch
```

### Environment Variables

```env
JWT_SECRET=your-super-secret-key-here
PORT=3000
MONGODB_URI=mongodb://localhost:27017/flashcards
```

---

## API Quick Reference

### Authentication
- `POST /auth/register` - Create new user
- `POST /auth/login` - Get JWT token

### Users
- `GET /users?page=1&limit=10` - List all users (paginated)
- `GET /users/:id` - Get single user
- `PUT /users/:id` - Update user (protected)
- `DELETE /users/:id` - Delete user (protected)

### Flashcards
- `GET /flashcards?page=1&limit=10` - List user's flashcards (protected)
- `GET /flashcards/:cardId` - Get single flashcard (protected)
- `POST /flashcards` - Create flashcard (protected)
- `PUT /flashcards/:cardId` - Update flashcard (protected)
- `DELETE /flashcards/:cardId` - Delete flashcard (protected)

### File Uploads
- `POST /upload` - Upload file (protected)
- `GET /upload/:filename` - Download file
- `DELETE /upload/:filename` - Delete file (protected)

Full documentation: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## Project Structure

```
.
├── controllers/              # Route handlers
│   ├── authController.ts    # Login & register
│   ├── userController.ts    # User CRUD
│   ├── flashcardController.ts
│   └── uploadController.ts  # File uploads
├── models/                  # MongoDB schemas
│   ├── userModel.ts
│   └── flashcardModel.ts
├── routes/                  # Express route definitions
│   ├── auth.ts
│   ├── users.ts
│   ├── flashcards.ts
│   └── uploads.ts
├── middleware/              # Auth & upload middleware
│   ├── authMiddleware.ts
│   └── uploadMiddleware.ts
├── utils/                   # Helper functions
│   ├── validators.ts        # Input validation
│   └── pagination.ts        # Pagination helpers
├── tests/                   # Jest test suites
│   ├── controllers/
│   └── utils/
├── uploads/                 # User uploaded files (gitignored)
├── index.ts                 # Server entry point
├── mongoose.ts              # DB connection
├── jest.config.json        # Jest configuration
└── .env                     # Environment variables (gitignored)
```

---

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Test files:
- `tests/controllers/auth.test.ts` - Auth controller tests
- `tests/utils/validators.test.ts` - Validator tests
- `tests/utils/pagination.test.ts` - Pagination tests

---

## Security Features

🔒 **JWT Authentication** - Token-based auth with expiration
🔒 **Password Hashing** - Bcrypt with 10-round salting
🔒 **Input Validation** - Email format, length constraints
🔒 **Authorization Checks** - User ownership verification
🔒 **File Upload Security** - Type & size restrictions
🔒 **Directory Traversal Protection** - Filename validation
🔒 **CORS Enabled** - Cross-origin resource sharing
🔒 **Error Sanitization** - No sensitive data leaks

---

## Usage Example

### 1. Register User

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response includes JWT token:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### 3. Create Flashcard (Protected)

```bash
curl -X POST http://localhost:3000/flashcards \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is the capital of France?",
    "answer": "Paris",
    "difficulty": "easy"
  }'
```

### 4. List Flashcards with Pagination

```bash
curl http://localhost:3000/flashcards?page=1&limit=10 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Validation Rules

### User Registration
- **Name**: 2-100 characters
- **Email**: Valid email format
- **Password**: Minimum 6 characters

### Flashcard Creation
- **Question**: 5-1000 characters
- **Answer**: 5-5000 characters
- **Difficulty**: "easy", "medium", or "hard"

### File Upload
- **Allowed Types**: JPEG, PNG, PDF, DOC, DOCX
- **Max Size**: 10MB

---

## Error Handling

All errors return JSON with status code and message:

```json
{
  "error": "Invalid email format"
}
```

Validation errors return multiple messages:

```json
{
  "errors": [
    "Name must be between 2-100 characters",
    "Invalid email format"
  ]
}
```

---

## Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Paginated Response
```json
{
  "data": [ ... ],
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

## Common Issues

**"No token provided"** - Include Authorization header:
```
Authorization: Bearer <token>
```

**"Invalid token"** - Token expired or malformed. Login again.

**"Email already in use"** - Use a different email address.

**"Invalid file type"** - Upload only: JPEG, PNG, PDF, DOC, DOCX

---

## Performance Considerations

- Pagination limits to max 100 items per page
- Database queries optimized with skip/limit
- File uploads capped at 10MB
- JWT token expires after 7 days
- Indexes recommended on: `email`, `userId`

---

## Production Deployment

1. Set strong `JWT_SECRET` in `.env`
2. Use HTTPS for all connections
3. Configure MongoDB Atlas or external DB
4. Enable rate limiting (recommended)
5. Use reverse proxy (Nginx/Apache)
6. Monitor error logs
7. Set up database backups
8. Use PM2 for process management

---

## Contributing

1. Follow existing code structure
2. Add tests for new features
3. Run `npm test` before committing
4. Update API documentation
5. Use meaningful commit messages

---

## Support

For issues or questions, check:
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Complete API reference
- [tests/](./tests/) - Test examples
- Error messages in responses

---

## License

MIT
