//Importing the DB module and the Express
const connectToMongo = require("./db/db");
const express = require("express");
const cors = require("cors");

//Connection to the MongoDB
connectToMongo();
const app = express();
const port = 5000;

//To use JSON file in the backend
app.use(express.json());

//Using cors in the index js for using the REST in the browser
app.use(cors());

//Importing and using the module of route (Whenver the location in the first parameter will be visited the module imported in the second argument will be executed)
app.use("/api/user", require("./routes/user"));
app.use("/api/notes", require("./routes/notes"));

//The default root route of the app
app.get("/", (req, res) => {
   res.send("Root");
});
app.get("/free", (req, res) => {
   res.send("came here");
});

//Port to listen
app.listen(process.env.PORT || port, () => {
   console.log(`This app is listening on http://localhost:${port} port`);
});
