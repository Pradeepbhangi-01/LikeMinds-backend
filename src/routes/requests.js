const express = require("express");
const User = require("../models/user");
const requestRouter = express.Router();

// Feed api
requestRouter.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ message: "Found the results", users });
  } catch (error) {
    console.log(error);
    res.status(400).send("Something Went Wrong");
  }
});
module.exports = requestRouter;
