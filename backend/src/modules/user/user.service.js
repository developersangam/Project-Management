const generateToken = require("../../utils/generateToken");
const User = require("./user.model");

async function createUser(data) {
  const user = User.create(data);
  return user;
}

async function listUsers(filter = {}) {
  return User.find(filter).populate("organization").lean();
}

async function getUserById(id) {
  return User.findById(id).populate("organization").lean();
}

async function updateUser(id, updates) {
  return User.findByIdAndUpdate(id, updates, { new: true }).populate(
    "organization",
  );
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

async function findById(id) {
  console.log("Finding user by ID:", id);
  return User.findById(id);
}

async function login({ email, password }) {
  const identifier = email.trim().toLowerCase();

  const user = await findByEmailOrUsername(identifier);
  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new AppError(403, "Account is not active");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError(401, "Invalid email or password");
  }

  return {
    id: user._id,
    email: user.email,
    userName: user.userName,
    token: generateToken({
      id: user._id,
      email: user.email,
      userName: user.userName,
    }),
  };
}

module.exports = {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
  isEmailExist,
  isUsernameExist,
  findByEmailOrUsername,
  findById,
login,
};
