const express = require("express");
const cookieParser = require("cookie-parser");
const routes = require("./routes/index");
const { connectDB } = require("./config/db");

const PORT = 7000;
const app = express();

app.use(express.json());
app.use(cookieParser());

//All Routes
app.use("/", routes);

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
