require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

//DB connection 
const connectDB = require("./Config/db");



//Routes
const ConsulRoutes = require("./Routes/ConsultationRoutes/ConsultationRoutes");
const authRoutes = require("./Routes/AuthRoutes/AuthRoutes");
const adminRoutes = require("./Routes/AdminRoutes/AdminRoutes");
const ClientRoutes = require("./Routes/ClientRoutes/ClientRoutes");
const blogRoutes = require("./Routes/BlogRoutes/BlogRoutes");
const ContactUs = require("./Routes/ContactRoutes/ContactRoutes");

const app = express();

connectDB();


app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/consultations", ConsulRoutes);
app.use("/admin", adminRoutes);
app.use("/client", ClientRoutes);
app.use("/users", authRoutes);
app.use("/api", ContactUs);
app.use("/blog", blogRoutes);
//Here is the documents routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});