const User = require('../models/User');

async function createUser(data) {
  const user = User.create(data);
  return user;
}

async function listUsers(filter = {}) {
  return User.find(filter).populate('organization').lean();
}

async function getUserById(id) {
  return User.findById(id).populate('organization').lean();
}

async function updateUser(id, updates) {
  return User.findByIdAndUpdate(id, updates, { new: true }).populate('organization');
}

async function deleteUser(id) {
  return User.findByIdAndDelete(id);
}

async function isEmailExist(email) {
  return User.findOne({ email });
}

async function isUsernameExist(userName) {
  return User.findOne({ userName });
}

async function findByEmailOrUsername(val) {
    return User.findOne({ $or: [{ email: val }, { userName: val }] });
}

module.exports = { createUser, listUsers, getUserById, updateUser, deleteUser, isEmailExist, isUsernameExist, findByEmailOrUsername };