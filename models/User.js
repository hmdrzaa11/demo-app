let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let validator = require("validator");
let bcrypt = require("bcryptjs");

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

let User = mongoose.model("User", userSchema);

module.exports = User;
