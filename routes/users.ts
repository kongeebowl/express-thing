const express = require("express");
const router = new express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", auth, userController.index);
router.get("/:id", auth, userController.show);
router.delete("/:id", auth, userController.destroy);

module.exports = router;
