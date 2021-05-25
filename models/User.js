let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let validator = require("validator");
let bcrypt = require("bcryptjs");
let crypto = require("crypto");

let userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "name is required"],
  },

  lastName: {
    type: String,
    trim: true,
    required: [true, "lastname is required"],
  },

  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    lowercase: true,
    validate: {
      validator(value) {
        return validator.default.isEmail(value);
      },

      message(prop) {
        return `${prop.value} is not a valid Email.`;
      },
    },
  },
  password: {
    type: String,
    required: [true, "password is required"],
    trim: true,
    minlength: [8, "password must be  at least  8 character"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "PasswordConfirm is required field"],
    validate: {
      validator(value) {
        return value === this.password;
      },
      message: "'password' and 'passwordConfirm' do not match!",
    },
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

//hash the password

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

//check password

userSchema.methods.isPasswordMatch = async function (rawPassword) {
  return await bcrypt.compare(rawPassword.toString(), this.password);
};

//generate password reset token

userSchema.methods.generatePasswordToken = async function () {
  let token = await crypto.randomBytes(32).toString("hex");
  let hash = crypto.createHash("sha256").update(token).digest("hex");
  //only for 10 min

  this.passwordResetToken = hash;
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  //save the user
  await this.save({ validateBeforeSave: false });
  return token;
};

let User = mongoose.model("User", userSchema);

module.exports = User;
