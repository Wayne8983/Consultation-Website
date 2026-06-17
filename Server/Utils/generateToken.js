const jwt = require("jsonwebtoken");

const generateAccessToken = (user,userType) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      userType

    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "2h",
    }
  );
};

const generateRefreshToken = (user,userType) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      userType
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};