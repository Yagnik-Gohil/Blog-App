const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "A user must have a email"],
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Invalid Email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (obj) {
        return obj === this.password;
      },
      message: "Password not matched!",
    },
  },
  name: {
    type: String,
  },
  image: {
    type: String,
    default: "default.png",
  },
});

userSchema.pre("save", async function (next) {
  this.password = await bcryptjs.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.methods.comparePassword = async function (myPassword, dbPassword) {
  return await bcryptjs.compare(myPassword, dbPassword);
};

const User = mongoose.model("User", userSchema);

export default User
