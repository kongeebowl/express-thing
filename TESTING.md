# Testing Guide

This project uses Jest for unit and integration testing with TypeScript support via ts-jest.

## Setup

Jest and its dependencies are already installed in the project:
- `jest` - Testing framework
- `ts-jest` - TypeScript support for Jest
- `@types/jest` - Jest type definitions

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Structure

Tests are organized in the `__tests__` directory with the following structure:

```
__tests__/
├── authController.test.ts       # Authentication controller tests
├── userController.test.ts       # User controller tests
├── flashcardController.test.ts  # Flashcard controller tests
├── testUtils.ts                 # Shared test utilities and database helpers
└── integration.test.ts          # Integration tests (database operations)
```

## Test Files Overview

### authController.test.ts
Tests for authentication endpoints:
- `signUp` - User registration functionality
- `signIn` - User login and JWT token generation
- `logout` - User logout

**Coverage:**
- Valid registration
- Duplicate user prevention
- Valid login
- Invalid credentials
- Error handling

### userController.test.ts
Tests for user management endpoints:
- `index` - Get all users
- `show` - Get single user by ID
- `destroy` - Delete user account

**Coverage:**
- Retrieving all users
- Retrieving single user
- User not found scenarios
- User deletion
- Error handling

### flashcardController.test.ts
Tests for flashcard CRUD operations:
- `index` - Get all flashcards for user
- `create` - Create new flashcard
- `find` - Get single flashcard
- `update` - Update flashcard
- `destroy` - Delete flashcard

**Coverage:**
- User-scoped flashcard retrieval
- Flashcard creation
- Authorization checks (user ownership)
- 404 scenarios
- Database errors

### testUtils.ts
Shared utilities for testing:
- `connectDB()` - Connect to test database
- `disconnectDB()` - Disconnect from test database
- `clearDB()` - Clear all collections
- `createTestUser()` - Create test user fixture
- `createTestFlashcard()` - Create test flashcard fixture

### integration.test.ts
Integration tests for database operations:
- User creation and validation
- Flashcard CRUD with real database
- Duplicate prevention
- Relationship testing

**Note:** Integration tests are currently disabled (commented out). To enable them:
1. Set `TEST_MONGO_URI` environment variable
2. Uncomment the `beforeAll`, `afterAll`, and `beforeEach` hooks
3. Uncomment the test implementations

## Writing New Tests

### Unit Test Template

```typescript
import { Request, Response } from "express";
import * as controller from "../controllers/myController";

jest.mock("../models/myModel");

describe("My Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("myFunction", () => {
    it("should do something", async () => {
      await controller.myFunction(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
```

## Mocking

Tests use Jest mocking to isolate controller logic from database operations:

```typescript
jest.mock("../models/user");
// Then use mocks in tests:
(User.findOne as jest.Mock).mockResolvedValue(mockUser);
```

## Test Coverage Goals

Current coverage targets:
- Controllers: 80%+
- Middleware: 70%+
- Routes: 60% (integration tests)
- Models: 50% (covered by controller tests)

View coverage report:
```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory.

## Debugging Tests

Run a single test file:
```bash
npx jest __tests__/authController.test.ts
```

Run a specific test:
```bash
npx jest --testNamePattern="should create a new user"
```

Debug with verbose output:
```bash
npx jest --verbose
```

## CI/CD Integration

Add to your CI/CD pipeline:
```bash
npm test -- --coverage --watchAll=false
```

This ensures tests run once with coverage reporting in automated environments.

## Best Practices

1. **Keep tests focused** - One assertion per test when possible
2. **Use descriptive names** - Test names should explain what they test
3. **Mock external dependencies** - Database, APIs, file system, etc.
4. **Test error cases** - Not just the happy path
5. **Clear before each** - Reset mocks between tests
6. **Use fixtures** - testUtils.ts for common test data setup

## Resources

- [Jest Documentation](https://jestjs.io/)
- [ts-jest Documentation](https://kulshekhar.github.io/ts-jest/)
- [Jest Mocking Documentation](https://jestjs.io/docs/mock-functions)
