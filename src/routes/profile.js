const express = require("express");
const User = require("../models/user");
const { authCheck } = require("../middlewares/auth");
const { userUpdateValidation } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.patch("/edit", authCheck, (req, res) => {
  try {
    const isUpdateAllowed = userUpdateValidation(req);
    if (!isUpdateAllowed) {
      throw new Error("Check the edit Fields Some fields are not allowed");
    }

    const loggedInUser = req.user;

    console.log("loggedInUser", loggedInUser);
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    console.log("loggedInUser", loggedInUser);

    loggedInUser.save();

    return res
      .status(200)
      .json({
        message: `Details of ${loogedInUser.firstName} updated Successfully`,
        data: loggedInUser,
        code: "success",
        success: true,
      });
  } catch (error) {
    res
      .status(400)
      .json({ message: error.message, code: "failure", success: false });
  }
});

module.exports = profileRouter;
