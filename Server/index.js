require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./Config/db");
const sanitizeRequest = require("./Utils/sanitizeRequest");

const ConsulRoutes = require("./Routes/ConsultationRoutes/ConsultationRoutes");
const authRoutes = require("./Routes/AuthRoutes/AuthRoutes");
const adminRoutes = require("./Routes/AdminRoutes/AdminRoutes");
const ClientRoutes = require("./Routes/ClientRoutes/ClientRoutes");
const blogRoutes = require("./Routes/BlogRoutes/BlogRoutes");
const ContactUs = require("./Routes/ContactRoutes/ContactRoutes");

const app = express();

connectDB();

app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL ,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
app.use(sanitizeRequest);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

const publicFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/users/login", authLimiter);
app.use("/api/consultations", publicFormLimiter);
app.use("/api/contactMessage", publicFormLimiter);

app.use("/api/consultations", ConsulRoutes);
app.use("/admin", adminRoutes);
app.use("/client", ClientRoutes);
app.use("/users", authRoutes);
app.use("/api", ContactUs);
app.use("/blog", blogRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((err, req, res, next) => {
  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});