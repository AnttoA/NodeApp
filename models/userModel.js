const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter email'],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'please provide a password'],
    minlength: 8,
    select: false, // wont show in any response to cinet
  },
  passwordConfrim: {
    type: String,
    required: [true, 'please confrim your password '],
    validate: {
      // This only works on Create and save !!
      validator: function (el) {
        return el === this.password; // abc === abc
      },
      message: 'Passwords are not the same ',
    },
  },
});

userSchema.pre('save', async function (next) {
  // only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  //Hash with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //delete confirm password field
  this.passwordConfrim = undefined;
  next();
});

//instance method , availabe on all docuemnts

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassowrd
) {
  return await bcrypt.compare(candidatePassword, userPassowrd);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
