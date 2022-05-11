const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: [true, 'must provide name'],
    trim: true,
    maxlength: [20, 'name can not be more than 20 characters'],
  },
  email: {
    type: String,
    required: [true, 'must provide email'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'must provide password'],
    trim: true,
    maxlength: [20, 'password can not be more than 20 characters'],
  },

  confirmPassword: {
    type: String,
    required: [true, 'must confirm password'],
    trim: true,
    maxlength: [20, 'password can not be more than 20 characters'],
  },
  
  isAdmin: {
    type: Boolean,
    default: false,
  },
})

module.exports = mongoose.model('users', userSchema)
