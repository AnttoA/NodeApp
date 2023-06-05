const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const signToken = (id, name) => {
  return jwt.sign({ id: id, username: name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  const { name, email, password, passwordConfrim } = req.body;
  try {
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfrim,
    });
    const token = signToken(newUser._id, name);
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    res.status(401).json({ status: 'fail', error });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  //check email and pass exist

  if (!email || !password) {
    return res
      .send(400)
      .json({ status: 'fail', messgae: 'please provide email and password ' });
  }
  // check if user exist and password is correct

  try {
    const user = await User.findOne({ email }).select('+password');
    const correct = user.correctPassword(password, user.password);
    if (!user || !correct) {
      return res.status(400).json({ message: 'unauthorized' });
    }
    const token = signToken(user._id, user.name);
    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (error) {
    res.status(400).json({ message: 'user not found' });
  }

  // if everythig is find send token to client
};
