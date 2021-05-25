let User = require("../models/User");
let generateJwt = require("../utils/generateJwt");

exports.signUpUsers = async (req, res) => {
  try {
    let newUser = await User.create({
      name: req.body.name,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    generateJwt(newUser, 201, res);
  } catch (error) {
    res.status(400).json({
      status: "failed",
      error,
    });
  }
};
