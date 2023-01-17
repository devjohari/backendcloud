//Code to import the mongoose in the JS file
const mongoose = require("mongoose");
const { Schema } = mongoose;

//The Schema is a constructor that accepts the schema in a object as a parameter defigning the required, unique and data type of an data field
const UserSchema = new Schema({
   name: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
   },
   password: {
      type: String,
      required: true,
   },
   date: {
      type: Date,
      default: Date.now,
   },
});

//Saving the mongoose model in the User variable
const User = mongoose.model("user", UserSchema);

//This exports a mongoose model
module.exports = User;
