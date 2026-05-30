require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/User");

const test = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log("Connecting to:", uri.replace(/:[^:]*@/, ":****@"));
    await mongoose.connect(uri);
    console.log("Connected successfully!");

    const userCount = await User.countDocuments();
    console.log("Number of users in DB:", userCount);

    const admin = await User.findOne({ username: "admin" });
    console.log("Admin user exists:", !!admin);
    if (admin) {
      console.log("Admin email:", admin.email);
    }
  } catch (err) {
    console.error("Connection failed:", err.message);
  } finally {
    await mongoose.connection.close();
  }
};

test();
