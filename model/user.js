const { truncate } = require('fs/promises');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: false
  },
  password: {
    type: String,
    required: false
  }
});

const user = mongoose.model('User', userSchema);
module.exports = user;
