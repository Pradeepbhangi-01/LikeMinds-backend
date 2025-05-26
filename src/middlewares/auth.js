const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authCheck = async (req, res, next) => {
  try {
    console.log("Checked the authentication ");

    const { token } = req.cookies;

    if (!token) {
      throw new Error("Invalid token!!");
    }
    console.log("#############", token);
    const decodedObj = jwt.verify(token, "ARXSCdfsdscRsds");

    console.log("decoded", decodedObj);

    const { _id } = decodedObj;
    console.log("_id", _id);

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

module.exports = { authCheck };
