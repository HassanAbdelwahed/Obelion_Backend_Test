const User = require("../models/User.js");
const tryCatch = require("../helpers/tryCatch.js");
const { promisify } = require("util");

const jwt = require("jsonwebtoken");

exports.register = tryCatch(async (req, res, next) => {
  const { username, email, password, passwordConfirm, role } = req.body;
  const newUser = await User.create({
    username,
    email,
    password,
    role,
  });
  res.status(201).json(newUser);
});

exports.login = tryCatch(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "email and password should not be null" });
  }
  // get user from db
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({ message: "Wrong email or password" });
  }

  const token = getToken(user._id, user.role);
  user.password = undefined;

  res.status(statusCode).json({
    token,
    data: {
      user,
    },
  });
});

const getToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.authenticate = tryCatch(async (req, res, next) => {
  // Getting token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "please log in to get access" });
  }

  // get token data
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(401).json({ message: "User does not exist" });
  }
  req.user = currentUser;
  next();
});

exports.restrictTo = (role) => {
  return (req, res, next) => {
    if (role != req.user.role) {
      return res.status(402).json({ message: "You do not have permission" });
    }
    next();
  };
};
