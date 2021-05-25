let User = require("../models/User");
let generateJwt = require("../utils/generateJwt");
let sendEmail = require("../utils/sendEmail");
let crypto = require("crypto");

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

exports.forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;
    //find the user with email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "failed",
        error: "there is no user related to this email!",
      });
    }

    //generate a random token
    let resetToken = await user.generatePasswordToken();

    //url
    let resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/reset-password/${resetToken}`;
    let message = `Forgot your password send a PATCH request to ${resetUrl} \n and send Password and PasswordConfirm\n if did not forget your password ignore this`;
    try {
      await sendEmail({
        email: user.email,

        subject: "Your password reset token (Valid for only 10 min)",

        message: message,
      });

      res.status(200).json({
        status: "success",

        message: "token sent to email",
      });
    } catch (error) {
      user.passwordResetToken = undefined;

      user.passwordResetExpires = undefined;

      await user.save({ validateBeforeSave: false });
      res.status(500).json({
        status: "failed",
        error: "Email Provider is not responding please try later",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "failed",
      error,
    });
  }
};

exports.passwordReset = async (req, res, next) => {
  let token = req.params.token;
  let { password, passwordConfirm } = req.body;
  let hash = crypto.createHash("sha256").update(token).digest("hex");

  let user = await User.findOne({
    passwordResetToken: hash,
    passwordResetExpires: { $gte: new Date() },
  });

  if (!user) {
    return res.status(404).json({
      status: "failed",
      error: "token is expired please try again",
    });
  }

  //here we set the new password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // login the user again

  generateJwt(user, 200, res);
};
