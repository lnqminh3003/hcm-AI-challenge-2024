const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  videoId: { type: String, required: true },
  frameId: { type: String, required: true }
});

// Define the query schema
const querySchema = new mongoose.Schema({
  queryName: { type: String, required: true },
  users: {
    type: Map,
    of: userSchema  // Use the user schema for the values in the Map
  }
});

// Create a model for the queries collection
const Query = mongoose.model('Query', querySchema, 'AIC'); // 'queries' is the name of the collection

module.exports = Query;
