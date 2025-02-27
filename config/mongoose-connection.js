const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Database");
  } catch (err) {
    console.error("Mongodb connection error: ", err);
    process.exit(1);
  }
};

module.exports = connectDb;
