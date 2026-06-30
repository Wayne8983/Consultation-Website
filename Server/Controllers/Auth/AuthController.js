const Admin = require("../../Models/Admin/Admin.model");
const Client = require("../../Models/Clients/Client.model");
const { ConfirmHash } = require("../../Utils/HashPassword");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../Utils/generateToken");
const jwt = require("jsonwebtoken");

const refreshCookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const normalizeCredentials = (email, password) => {
  if (typeof email !== "string" || typeof password !== "string") {
    return null;
  }

  return {
    email: email.trim().toLowerCase(),
    password,
  };
};

const buildUserPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

const sendAuthResponse = (res, user, userType) => {
  const token = generateAccessToken(user, userType);
  const refreshToken = generateRefreshToken(user, userType);

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);

  return res.status(200).json({
    success: true,
    message: "Login Successful",
    token,
    userType,
    user: buildUserPayload(user),
  });
};

const logIn = async (req, res) => {
  try {
    const credentials = normalizeCredentials(req.body.email, req.body.password);

    if (!credentials?.email || !credentials?.password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const { email, password } = credentials;

    const admin = await Admin.findOne({ email: { $eq: email } });

    if (admin) {
      const isMatch = await ConfirmHash(password, admin.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials!",
        });
      }

      await Admin.findByIdAndUpdate(admin._id, {
        lastLogin: new Date(),
      });

      return sendAuthResponse(res, admin, "admin");
    }

    const client = await Client.findOne({ email: { $eq: email } });

    if (client) {
      const isMatch = await ConfirmHash(password, client.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials!",
        });
      }

      if (client.status === "Suspended") {
        return res.status(403).json({
          success: false,
          message: "Account suspended temporarily. Contact organization for more info.",
        });
      }

      await Client.findByIdAndUpdate(client._id, {
        lastLogin: new Date(),
      });

      return sendAuthResponse(res, client, "client");
    }

    return res.status(401).json({
      success: false,
      message: "Invalid credentials!",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    if (!["admin", "client"].includes(decoded.userType)) {
      res.clearCookie("refreshToken", refreshCookieOptions);

      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const Model = decoded.userType === "admin" ? Admin : Client;
    const user = await Model.findById(decoded.id);

    if (!user) {
      res.clearCookie("refreshToken", refreshCookieOptions);

      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    if (decoded.userType === "client" && user.status === "Suspended") {
      res.clearCookie("refreshToken", refreshCookieOptions);

      return res.status(403).json({
        success: false,
        message: "Account suspended",
      });
    }

    const newAccessToken = generateAccessToken(user, decoded.userType);

    return res.status(200).json({
      success: true,
      token: newAccessToken,
      userType: decoded.userType,
      user: buildUserPayload(user),
    });
  } catch (error) {
    res.clearCookie("refreshToken", refreshCookieOptions);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

const logout = async (req, res) => {
  res.clearCookie("refreshToken", refreshCookieOptions);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

module.exports = {
  logIn,
  refreshToken,
  logout,
};