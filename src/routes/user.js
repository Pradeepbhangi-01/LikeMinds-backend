const express = require("express");
const { authCheck } = require("../middlewares/auth");
const { userUpdateValidation } = require("../utils/validation");
const User = require("../models/user");
const userRouter = express.Router();

//Get the Single User
userRouter.get("/:emailId", authCheck, async (req, res) => {
  try {
    const emailId = req.params.emailId;
    console.log("emailId ", emailId);

    const user = await User.find({ emailId });

    if (user.length === 0) {
      res.status(400).json({ message: "User Not Found" });
    } else {
      res.status(200).json({ message: "Found the results", user });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("User not found");
  }
});

userRouter.patch("/", authCheck, async (req, res) => {
  try {
    const isUpdateAllowed = userUpdateValidation(req);

    const loggedInUser = req.user;

    console.log(loggedInUser);
    if (!isUpdateAllowed) {
      throw new Error("Update is not allowed, check the update fields");
    }
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    console.log(loggedInUser);
    await loggedInUser.save();

    return res
      .status(200)
      .json({ message: "User updated successfully", data: loggedInUser });
  } catch (error) {
    console.log(error);
    res.status(400).send("Update is not allowed, check the update fields");
  }
});

userRouter.delete("/", async (req, res) => {
  try {
    const emailId = req.body.emailId;

    const response = await User.deleteOne({ emailId });

    if (response) {
      res.status(200).json({ message: "Deleted Successfully" });
    } else {
      res.status(400).json({ message: "User Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Unable to delete the User");
  }
});

module.exports = userRouter;
