const jwt = require("jsonwebtoken");
const User = require("../modules/user/user.model");
const { AppError } = require("../utils/AppError");

const protect = async (req, res, next) => {
  try {
    let token;
    //Check if token exists
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError(401, "Not authorized, token missing");
    }

    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //Fetch user from DB
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw new AppError(401, "User no longer exists");
    }

    if (!user.isActive) {
      throw new AppError(403, "User account is inactive");
    }
    //Attach user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};  

module.exports = protect;
