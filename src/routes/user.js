const express = require("express");
const { authCheck } = require("../middlewares/auth");
const { userUpdateValidation } = require("../utils/validation");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

const SAFE_USER_DATA = "firstName lastName age gender photoUrl about skills";

// Get the pending connection request for the logged in user
userRouter.get("/requests/received", authCheck, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      receiverUserId: loggedInUser._id,
      status: "interested",
    }).populate(
      "senderUserId",
      "firstName lastName age gender photoUrl about skills"
    );
    // }).populate("senderUserId", ["firstName", "lastName"]);

    res.status(200).json({
      message: "Details fetched successfully",
      data: connectionRequests,
      code: "success",
      success: true,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: error.message, code: "failure", success: false });
  }
});

userRouter.get("/connections", authCheck, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const myConnections = await ConnectionRequest.find({
      $or: [
        {
          senderUserId: loggedInUser._id,
          status: "accepted",
        },
        { receiverUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("senderUserId", SAFE_USER_DATA)
      .populate("receiverUserId", SAFE_USER_DATA);
    const filteredData = myConnections.map((row) => {
      if (row.senderUserId._id.toString() == loggedInUser._id.toString()) {
        return row.receiverUserId;
      }
      return row.senderUserId;
    });

    res.status(200).json({
      message: "Connection fetcehd successfully",
      data: filteredData,
      code: "success",
      success: true,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: error.message, code: "failure", success: false });
  }
});

module.exports = userRouter;
