const mongoose = require("mongoose");
const config = require("../config/config");

const connection = mongoose.connect(
  `${config.database.uri}/${config.database.database_name}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
  }
);

connection
  .then((db) => {
    console.log(`Successfully connected to MongoDB: ${config.database.database_name}`);
    return db;
  })
  .catch((err) => {
    if (err.message && err.message.includes("ETIMEDOUT")) {
      console.error("MongoDB connection timeout:", err);
    } else {
      console.error("Error connecting to MongoDB:", err);
    }
    process.exit(1); 
  });

module.exports = connection;
