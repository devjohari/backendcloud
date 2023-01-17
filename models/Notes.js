//Code to import the mongoose in the JS file
const mongoose = require("mongoose");
const { Schema } = mongoose;

//The Schema is a constructor that accepts the schema in a object as a parameter defigning the required, unique and data type of an data field
const NotesSchema = new Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
   },
   title: {
      type: String,
      required: true,
   },
   description: {
      type: String,
      required: true,
   },
   tag: {
      type: String,
      default: "general",
   },
   date: {
      type: Date,
      default: Date.now,
   },
});


//This exports a mongoose model
module.exports = mongoose.model("notes", NotesSchema);