//Importing the Express and the expressRouter and the User Schema
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//To import the express validator
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middlewares/fetchuser");

const secret = "devMon";

//Code to handle POST request whenever the user will hit this route
router.post(
   "/register",
   //An array for multiple validation in a body(No array needed for one field)
   [
      body("name", "Please enter atleast 3 character in name").isLength({
         min: 3,
      }),
      body("email", "The email is incorrect").isEmail(),
      body("password", "Please enter atleast 5 character in Password").isLength(
         { min: 5 }
      ),
   ],
   async (req, res) => {
      //This errors variable will save the result of the validation if it will not be empty means there is an validation error in our request body so the code in IF block will be executed(and will terminate immediately after that)
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
         //Will return a bad request to the client because of the validation error
         return res.status(400).json({ errors: errors.array() });
      }

      //A try block that will check for the error in the server
      try {
         //The variable user will save value when there is an existing email in the DB by using the method findOne with the User Schema otherwise if there is no email already then it will be null
         let user = await User.findOne({ email: req.body.email });

         if (user) {
            //Will return a bad request if there is an already existing email id
            return res
               .status(400)
               .json({ errors: "User with the same e-mail already exists" });
         }

         //Bcrypt for hashing your password
         const salt = await bcrypt.genSalt(10);
         const hash = await bcrypt.hash(req.body.password, salt);

         //If no error occoured till now then it will save the data in the database
         user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hash,
         });

         const data = {
            user: {
               id: user.id,
            },
         };
         const token = jwt.sign(data, secret);
         //And after saving the data it will send an response 200 which is ok
         // return res.status(200).json({ success: "User Created" });
         res.json({ token });
      } catch (err) {
         //Will send an 500 error that means internal server error in the server code and that means an error has occoured in the try block
         return res.status(500).json({ unexpected: "Internal server error!" });
      }
   }
);

router.post(
   "/login",
   [
      body("email", "Please enter a valid E-Mail").isEmail(),
      body("password", "Password field can't be empty").exists(),
   ],
   async (req, res) => {
      const valerror = validationResult(req);
      if (!valerror.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      try {
         const user = await User.findOne({ email });
         if (user) {
            const passwordMathced = await bcrypt.compare(
               password,
               user.password
            );
            if (passwordMathced) {
               const data = {
                  user: {
                     id: user.id,
                  },
               };
               const token = jwt.sign(data, secret);
               return res.json({ token });
            } else {
               return res.status(401).json({
                  error: "Please enter correct credentials and try again",
               });
            }
         } else {
            return res.status(401).json({
               error: "Please enter correct credentials and try again",
            });
         }
      } catch (error) {
         console.log(error);
         return res.status(500).json({ error: "Internal server error!" });
      }
   }
);

router.post("/getuser", fetchuser, async (req, res) => {
   try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
   } catch (error) {
      req.status(401).send("Authentication error!");
   }
});

//Code to export the module
module.exports = router;

// let user = await User.findOne({email});
//     if(!user){
//       return res.status(400).json({error: "Please try to login with correct credentials"});
//     }
