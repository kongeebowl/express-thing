import { Request, Response } from "express";
const authController = require("../controllers/authController");
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

jest.mock("../models/user");
jest.mock("jsonwebtoken");
jest.mock("bcrypt");

describe("Auth Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      sendStatus: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("signUp", () => {
    it("should return 409 if user already exists", async () => {
      req.body = {
        name: "John",
        email: "john@example.com",
        password: "password123",
      };
      (User.findOne as jest.Mock).mockResolvedValue({
        email: "john@example.com",
      });

      await authController.signUp(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(409);
    });

    it("should create a new user successfully", async () => {
      req.body = {
        name: "John",
        email: "john@example.com",
        password: "password123",
      };
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue({
        save: jest.fn().mockResolvedValue({}),
      });

      await authController.signUp(req as Request, res as Response);

      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it("should return 500 on error", async () => {
      req.body = {
        name: "John",
        email: "john@example.com",
        password: "password123",
      };
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockRejectedValue(new Error("DB Error"));

      await authController.signUp(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("signIn", () => {
    it("should return 401 if user not found", async () => {
      req.body = { email: "notfound@example.com", password: "password123" };
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await authController.signIn(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 401 if password is incorrect", async () => {
      req.body = { email: "john@example.com", password: "wrongpassword" };
      const mockUser = { password: "hashedpassword" };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await authController.signIn(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 200 and token on successful login", async () => {
      req.body = { email: "john@example.com", password: "password123" };
      const mockUser = {
        name: "John",
        email: "john@example.com",
        password: "hashedpassword",
        toJSON: jest
          .fn()
          .mockReturnValue({ name: "John", email: "john@example.com" }),
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("jwt-token");

      await authController.signIn(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("should return 204 No Content", async () => {
      await authController.logout(req as Request, res as Response);

      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });
  });
});
