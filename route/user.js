const express = require("express");
const userController = require("../controller/user.controller");

const router = express.Router();

router.get("/signup/:username", userController.createUser);
router.get("/login/:username", userController.login);

module.exports = router;
