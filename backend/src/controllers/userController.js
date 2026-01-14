const userService = require('../services/userService');
const generateToken = require('../utils/generateToken');

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await userService.isEmailExist(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is not active. Please contact support."
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      userName: user.userName
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        email: user.email,
        userName: user.userName,
        token
      }
    });
  } catch (err) {
    next(err);
  }
}


async function registerUser(req, res, next) {
  try {
    const {email, password, lastName, firstName, userName, dateOfBirth} = req.body;

    //check if user with email already exists
    const userEmailExist = await userService.isEmailExist(email);
    if (userEmailExist) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }

    const userUserNameExist = await userService.isUsernameExist(userName);
    if (userUserNameExist) {
      return res.status(400).json({ success: false, error: 'User with this username already exists' });
    }

    const user = await userService.createUser({email, password, lastName, firstName, userName, dateOfBirth});
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        email: user.email,
        userName: user.userName
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}

const getUserProfile = async (req, res, next) => {
  console.log(req.user)
  try {
    const user = req.user
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id : user._id,
        email : user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userName : user.userName,
        dateOfBirth : user.dateOfBirth
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { loginUser, registerUser, getUserProfile };