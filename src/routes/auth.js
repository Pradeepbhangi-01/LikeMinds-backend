const express = require("express");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { validationSignup, validateSignIn } = require("../utils/validation");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    validationSignup(req);

    const { firstName, lastName, emailId, password, age, gender } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    console.log("passwordHash", passwordHash);

    const userObj = {
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
    };

    const user = new User(userObj);

    await user.save();

    res.send("User Created");
  } catch (error) {
    console.log(error);
    res.status(400).send("ERROR:- " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    validateSignIn(req);

    const { emailId, password } = req.body;

    const emailPresent = await User.findOne({ emailId });
    if (!emailPresent) {
      res.status(400).send("Invalid Credentials");
    }

    const validUser = await bcrypt.compare(password, emailPresent.password);
    console.log("validUser ", validUser);

    if (validUser) {
      const token = jwt.sign({ _id: emailPresent?._id }, "ARXSCdfsdscRsds", {
        expiresIn: "1h",
      });

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(token);
    } else {
      res.send("Invalid Credentials");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("ERROR:- " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .status(200)
      .send("Logged Out Successfully");
  } catch (error) {
    console.log(error);
    res.status(200).send("Logged Out Successfully");
  }
});
module.exports = authRouter;
