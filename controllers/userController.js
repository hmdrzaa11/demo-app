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

exports.loginUsers = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "failed",
        error: "email and password required",
      });
    }

    //find user by email
    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        status: "failed",
        error: "invalid email or password",
      });
    }

    //check password

    let isPasswordMatch = await user.isPasswordMatch(password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        status: "failed",
        error: "invalid email or password",
      });
    }

    //here we have valid user so we generate the token

    generateJwt(user, 200, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      error,
    });
  }
};
