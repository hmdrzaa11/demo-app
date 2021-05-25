let router = require("express").Router();
let userController = require("../controllers/userController");

router.post("/signup", userController.signUpUsers);

router.post("/login", userController.loginUsers);

router.post("/forgot-password", userController.forgotPassword);

module.exports = router;
