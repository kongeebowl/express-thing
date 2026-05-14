import { Request, Response } from "express";
const userController = require("../controllers/userController");
import { User } from "../models/user";

jest.mock("../models/user");

describe("User Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      sendStatus: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("index", () => {
    it("should return all users", async () => {
      const mockUsers = [
        { id: "1", name: "John", email: "john@example.com" },
        { id: "2", name: "Jane", email: "jane@example.com" },
      ];
      (User.find as jest.Mock).mockResolvedValue(mockUsers);

      await userController.index(req as Request, res as Response);

      expect(res.send).toHaveBeenCalledWith(mockUsers);
    });
  });

  describe("show", () => {
    it("should return a user by ID", async () => {
      const mockUser = { id: "1", name: "John", email: "john@example.com" };
      req.params = { id: "1" };
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      await userController.show(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(mockUser);
    });

    it("should return null if user not found", async () => {
      req.params = { id: "999" };
      (User.findById as jest.Mock).mockResolvedValue(null);

      await userController.show(req as Request, res as Response);

      expect(res.send).toHaveBeenCalledWith(null);
    });
  });

  describe("destroy", () => {
    it("should delete a user successfully", async () => {
      const mockUser = {
        id: "1",
        name: "John",
        email: "john@example.com",
        deleteOne: jest.fn().mockResolvedValue({}),
      };
      req.params = { id: "1" };
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      await userController.destroy(req as Request, res as Response);

      expect(mockUser.deleteOne).toHaveBeenCalled();
      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    it("should return 404 if user not found", async () => {
      req.params = { id: "999" };
      (User.findById as jest.Mock).mockResolvedValue(null);

      await userController.destroy(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
