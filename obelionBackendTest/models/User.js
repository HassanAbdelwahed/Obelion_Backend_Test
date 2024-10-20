const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const validator = require("validator");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Enter your full Name"],
    },
    email: {
      type: String,
      required: [true, "Enter your email"],
      unique: true,
      validate: [validator.isEmail, "Email is not valid"],
    },
    password: {
      type: String,
      required: [true, "minimum length of password is 8 charcters"],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
