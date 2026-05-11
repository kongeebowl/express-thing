import express from "express";
const router = new express.Router();
const userController = await import("../controllers/userController.js");
const auth = await import("../middleware/auth.js");

router.get("/", auth, userController.index);
router.get("/:id", auth, userController.show);
router.delete("/:id", auth, userController.destroy);

export { router };
