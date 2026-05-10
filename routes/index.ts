const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const userRoutes = require("./users");
const flashcardRoutes = require("./flashcards");

router.use("/users", userRoutes);
router.use("/flashcards", auth, flashcardRoutes);

module.exports = router;