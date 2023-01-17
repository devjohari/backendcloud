//Code to import the Express and expressRouter
const { default: userEvent } = require("@testing-library/user-event");
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { set } = require("mongoose");
const fetchuser = require("../middlewares/fetchuser");
const Notes = require("../models/Notes");

//Route for the adding note "http://localhost:5000/api/notes/fetchallnotes"
router.get("/fetchallnotes", fetchuser, async (req, res) => {
   try {
      let note = await Notes.find({ user: req.user.id }).sort({
         date: "desc",
      });
      res.send(note);
   } catch (error) {
      res.status(500).send("Internal server error");
   }
});

//Route for the adding note "http://localhost:5000/api/notes/addnote"
router.post(
   "/addnote",
   fetchuser,
   [
      body("title", "Title must be 3 characters long").isLength({ min: 3 }),
      body("description", "Description must be 5 characters long").isLength({
         min: 5,
      }),
   ],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty) {
         res.status(400).send(errors.array());
      }
      const note = await Notes.create({
         user: req.user.id,
         title: req.body.title,
         description: req.body.description,
         tag: req.body.tag,
      });
      res.send(note);
   }
);

//Route for updating note "http://localhost:5000/api/notes/updatenote/:id"
router.put("/updatenote/:id", fetchuser, async (req, res) => {
   let newData = {};
   if (req.body.title) {
      newData.title = req.body.title;
   }
   if (req.body.description) {
      newData.description = req.body.description;
   }
   if (req.body.tag) {
      newData.tag = req.body.tag;
   }
   try {
      const note = await Notes.findById(req.params.id);
      if (!note) {
         res.status(401).send("Invalid request!");
      }
      if (req.user.id !== note.user.toString()) {
         res.status(401).send("Invalid request!");
      }
      const result = await Notes.findByIdAndUpdate(
         req.params.id,
         { $set: newData },
         { new: true }
      );
      res.send({ status: "successfull", message: result });
   } catch (error) {
      res.status(500).send("Internal server error");
   }
});

// Route for DELETING note "http://localhost:5000/api/notes/deletenotes/:id"
router.delete("/deletenotes/:id", fetchuser, async (req, res) => {
   try {
      const note = await Notes.findById(req.params.id);
      if (!note) {
         res.status(404).send("Not found");
      }
      if (req.user.id !== note.user.toString()) {
         res.status(401).send("Invalid request");
      }
      await Notes.findByIdAndDelete(req.params.id);
      res.send("Success");
   } catch (error) {
      res.status(500).send("Internal server error!");
   }
});

//Exporting the module
module.exports = router;
