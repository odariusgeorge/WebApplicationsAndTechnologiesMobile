const express = require('express');
const router  = express.Router();

const checkAuth = require("../middleware/check-auth");
const checkAdmin = require("../middleware/check-admin");

const UserController = require("../controllers/user");


router.get("", checkAdmin, UserController.getUsers);

router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

router.post("/createModerator", checkAdmin, UserController.createModerator);

router.put("/modifyPassword/:id", checkAdmin, UserController.modifyPassword);

router.delete("/:id", checkAdmin, UserController.deleteUser);

module.exports = router;
