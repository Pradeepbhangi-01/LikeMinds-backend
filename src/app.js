const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { authCheck } = require("./middlewares/auth");
const { connectDB } = require("./config/db");
const User = require("./models/user");
const { validationSignup, validateSignIn } = require("./utils/validation");
const bcrypt = require("bcrypt");

const PORT = 7000;
const app = express();

app.use(express.json());
app.use(cookieParser());

// Feed api
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ message: "Found the results", users });
  } catch (error) {
    console.log(error);
    res.status(400).send("Something Went Wrong");
  }
});

//Get the Single User
app.get("/user/:emailId", authCheck, async (req, res) => {
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

app.patch("/user", authCheck, async (req, res) => {
  try {
    const { id } = req.body;

    const data = req.body;

    const response = await User.findByIdAndUpdate(id, data, {
      runvalidators: true,
    });

    console.log("response ", response);

    if (response) {
      res.status(200).json({ message: "Updated Successfully" });
    } else {
      res.status(400).json({ message: "User Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Unable to delete the User");
  }
});

app.delete("/user", async (req, res) => {
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

app.post("/signin", async (req, res) => {
  try {
    validateSignIn(req);

    const { emailId, password } = req.body;

    const emailPresent = await User.findOne({ emailId });
    if (!emailPresent) {
      res.status(400).send("Invalid Credentials");
    }

    console.log("emailPresent ", emailPresent);

    const validUser = await bcrypt.compare(password, emailPresent.password);
    console.log("validUser ", validUser);

    if (validUser) {
      const token = jwt.sign({ _id: validUser?._id }, "ARXSCdfsdscRsds", {
        expiresIn: "1h",
      });

      res.cookie("token", token);
      res.send(token);
    } else {
      res.send("Invalid Credentials");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("ERROR:- " + error.message);
  }
});

app.post("/signup", async (req, res) => {
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

// Handling the Errors od application
app.use("/", (error, req, res, next) => {
  if (error) {
    console.log("Application Error ", error);
    res.status(500).send("Something went wrong");
  }
});

connectDB()
  .then(() => {
    console.log("DB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB connecion issue", err);
  });
