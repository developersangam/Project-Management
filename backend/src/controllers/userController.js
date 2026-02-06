const userService = require("../services/userService");
const { successResponse } = require("../utils/apiResponse");
const { AppError } = require("../utils/AppError");
const generateToken = require("../utils/generateToken");

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await userService.isEmailExist(email);

    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    if (!user.isActive) {
      throw new AppError(403, "Account is not active. Please contact support.");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError(401, "Invalid email or password");
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      userName: user.userName,
    });

    return successResponse(res, 200, "Login successful", {
      id: user._id,
      email: user.email,
      userName: user.userName,
      token,
    });
  } catch (err) {
    next(err);
  }
}

async function registerUser(req, res, next) {
  try {
    const { email, password, lastName, firstName, userName, dateOfBirth } =
      req.body;

    //check if user with email already exists
    const userEmailExist = await userService.isEmailExist(email);
    if (userEmailExist) {
      throw new AppError(400, "User with this email already exists");
    }

    const userUserNameExist = await userService.isUsernameExist(userName);
    if (userUserNameExist) {
      throw new AppError(400, "User with this username already exists");
    }

    const user = await userService.createUser({
      email,
      password,
      lastName,
      firstName,
      userName,
      dateOfBirth,
    });
    return successResponse(res, 201, "User registered successfully", {
      id: user._id,
      email: user.email,
      userName: user.userName,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
}

const getUserProfile = async (req, res, next) => {
  console.log(req.user);
  try {
    const user = req.user;
    if (!user) {
      throw new AppError(404, "User not found");
    }
    return successResponse(res, 200, "User profile fetched successfully", {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      dateOfBirth: user.dateOfBirth,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { loginUser, registerUser, getUserProfile };
