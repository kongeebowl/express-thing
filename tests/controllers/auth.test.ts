import { Request, Response } from "express";
import { register, login } from "../../controllers/authController.js";
import User from "../../models/userModel.js";

jest.mock("../../models/userModel.js");

describe("Auth Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn().mockReturnValue({});
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockRequest = {};
    mockResponse = {
      json: jsonMock,
      status: statusMock,
    };
  });

  describe("register", () => {
    it("should register a user with valid data", async () => {
      mockRequest.body = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      const mockUser = {
        _id: "123",
        name: "John Doe",
        email: "john@example.com",
        save: jest.fn(),
      };

      (User as jest.Mock).mockImplementation(() => mockUser);
      (User.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      await register(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
    });

    it("should reject registration with invalid email", async () => {
      mockRequest.body = {
        name: "John Doe",
        email: "invalid-email",
        password: "password123",
      };

      await register(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it("should reject registration with short password", async () => {
      mockRequest.body = {
        name: "John Doe",
        email: "john@example.com",
        password: "pass",
      };

      await register(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
    });

    it("should reject registration if email already exists", async () => {
      mockRequest.body = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      (User.findOne as jest.Mock) = jest
        .fn()
        .mockResolvedValue({ email: "john@example.com" });

      await register(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(409);
    });
  });

  describe("login", () => {
    it("should login user with valid credentials", async () => {
      mockRequest.body = {
        email: "john@example.com",
        password: "password123",
      };

      const mockUser = {
        _id: "123",
        email: "john@example.com",
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      (User.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockUser);

      await login(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
    });

    it("should reject login with invalid email", async () => {
      mockRequest.body = {
        email: "invalid@example.com",
        password: "password123",
      };

      (User.findOne as jest.Mock) = jest.fn().mockResolvedValue(null);

      await login(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
    });

    it("should reject login with wrong password", async () => {
      mockRequest.body = {
        email: "john@example.com",
        password: "wrongpassword",
      };

      const mockUser = {
        _id: "123",
        email: "john@example.com",
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      (User.findOne as jest.Mock) = jest.fn().mockResolvedValue(mockUser);

      await login(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
    });
  });
});
