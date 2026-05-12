import express from "express";
const router = express.Router();
const userController = require("../controllers/userController");
import { verifyToken } from "../middleware/auth";

router.get("/", verifyToken, userController.index);
router.get("/:id", verifyToken, userController.show);
router.delete("/:id", verifyToken, userController.destroy);

module.exports = router;
