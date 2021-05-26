const mongoose = require('mongoose');

const users = new mongoose.Schema({
  givenName: { type: String, required: true },
  firstName: { type: String, required: true },
  birthday: { type: Date, required: true },
  phone: { type: String, required: true },
  email: { type: String, unique: true, required: true },
});

module.exports = mongoose.model('Users', users);
