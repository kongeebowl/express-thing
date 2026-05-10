const express = require("express");
const router = new express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", auth, userController.getProfile);
router.post(
  "/profile/photo",
  auth,
  upload.single("photo"),
  userController.uploadProfilePicture,
);

module.exports = router;
