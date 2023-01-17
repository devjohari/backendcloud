//Code to import the mongoose and making a variable that stores the link to the database
const mongoose = require("mongoose");
const mongooseuri =
   "mongodb+srv://cloudnotes:cloudnotes@cluster0.6okuwvg.mongodb.net/?retryWrites=true&w=majority";

//This is a funtion that connects to the database.
mongoose.set("strictQuery", false);
var options = {
   keepAlive: 1,
   connectTimeoutMS: 30000,
   useNewUrlParser: true,
   useUnifiedTopology: true,
};
const connectToMongo = () => {
   //This connect method uses a callback method to connect to the database, first argument is the link to the database and second argument is reference of a funtion that wil be executed when the connection will be successfull
   mongoose
      .connect(mongooseuri, options)
      .then(() => {
         console.log("Connection to the database is successfull");
      })
      .catch((error) => {
         console.log(`Error in mongodb ${error}`);
      });
};

//Code to export the connectToMongo funtion (It is still not executed yet).
module.exports = connectToMongo;
