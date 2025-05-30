const express = require("express");
const User = require("../models/user");
const { authCheck } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
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

//- POST /request/send/interested/:userId

requestRouter.post(
  "/send/:status/:receiverUserId",
  authCheck,
  async (req, res) => {
    try {
      const senderUserId = req.user._id;
      console.log("sendUserId ", senderUserId);
      const status = req.params.status;
      const receiverUserId = req.params.receiverUserId;

      const allowedStatus = ["ignore", "interested"];

      if (!allowedStatus.includes(status)) {
        throw new Error(`Invalid status - ${status}`);
      }

      //check whether receiver emailid is present in usertable or not
      const validReceiver = await User.findById(receiverUserId);

      if (!validReceiver) {
        return res.status(404).json({
          message: `user not found with userid ${validReceiver}`,
          success: true,
          code: "failure",
        });
      }
      // Chcek if the already connection is there or not in both ways
      const existingConnection = await ConnectionRequest.findOne({
        $or: [
          {
            senderUserId,
            receiverUserId,
          },
          {
            senderUserId: receiverUserId,
            receiverUserId: senderUserId,
          },
        ],
      });

      console.log("existingConnection ", existingConnection);
      if (existingConnection) {
        throw new Error(
          `Connection is alredy present as status ${existingConnection.status}`
        );
      }
      const connectionRequest = new ConnectionRequest({
        senderUserId,
        receiverUserId,
        status,
      });
      const data = await connectionRequest.save();

      res.status(200).json({
        message: "Connetion request updated",
        data,
        code: "success",
        success: true,
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message, code: "failure", success: false });
    }
  }
);

requestRouter.post(
  "/review/:status/:requestId",
  authCheck,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;

      const allowedStatus = ["rejected", "accepted"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          mesaage: `${status} is not in allowed status`,
          success: false,
          code: "failure",
        });
      }

      const loggedInUser = req.user;
      //requestId should be present in the database
      // toUserid should be the loggedin userId
      // the status should be interested only

      const checkConnection = await ConnectionRequest.findOne({
        _id: requestId,
        receiverUserId: loggedInUser._id,
        status: "interested",
      });

      if (!checkConnection) {
        return res.status(400).json({
          message: "Connection is not found",
          code: "failure",
          success: false,
        });
      }

      checkConnection.status = status;

      const data = await checkConnection.save();

      res.status(200).json({
        message: `status is updated to ${status}`,
        data,
        code: "success",
        success: true,
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: error.message, code: "failure", success: false });
    }
  }
);

module.exports = requestRouter;
