const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  videoId: { type: String, required: true },
  frameId: { type: String, required: true },
  QA: { type: String, required: true },
  time: { type: Date, default: Date.now }, 
});


const querySchema = new mongoose.Schema({
  queryName: { type: String, required: true },
  users: {
    type: Map,
    of: userSchema  
  }
});

const Query = mongoose.model('Query', querySchema, 'AIC'); 

module.exports = Query;
