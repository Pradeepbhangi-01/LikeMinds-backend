const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authCheck = (req, res, next) => {
  try {
    console.log("Checked the authentication ");

    const { token } = req.cookies;

    if (!token) {
      throw new Error("Invalid token");
    }

    const decoded = jwt.verify(token, "ARXSCdfsdscRsds");

    console.log("decoded", decoded);

    next();
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

module.exports = { authCheck };
