const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let user = new Schema({
  // username: String,
  username: {
    type: String,
    // required: true,
    //you can create validation with specific message in scheema
    required: [true, "name not provided. Cannot create user without name "],
  },
  email: { 
    type: String,
    unique: [true, "email already exists in database!"],
    lowercase: true,
    trim: true,
    required: [true, "email field is not provided. Cannot create user without email "],
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: '{VALUE} is not a valid email!'
    }
  },
  mobile_no: String,
  password: String,
  user_type: {
    type: String,
    required: true
},
  status: Boolean
});

const model = mongoose.model("users", user);

module.exports = model;