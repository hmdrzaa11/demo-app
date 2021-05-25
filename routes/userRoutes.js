let router = require("express").Router();
let userController = require("../controllers/userController");

router.post("/signup", userController.signUpUsers);

module.exports = router;
