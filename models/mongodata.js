const mongoose = require('mongoose');

const mongoosedataSchema = new mongoose.Schema({
  name: {
   type: String,
  },
  
  age: {
    type: Number
  }
})

module.exports = mongoose.model('mongoosedata', mongoosedataSchema);