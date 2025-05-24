const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://BookBazaar:Book%402025@bookbazaardb.ben8rge.mongodb.net/LikeMinds"
  );
};

module.exports = { connectDB };
