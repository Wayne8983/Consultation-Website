const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL || process.env.MONGO_URI;

    if (!mongoUrl) {
      throw new Error(
        "Missing MongoDB connection string. Add MONGO_URL or MONGO_URI to Server/.env"
      );
    }

    const connection = await mongoose.connect(mongoUrl);

    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;