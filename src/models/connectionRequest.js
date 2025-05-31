const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema(
  {
    senderUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      reqired: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignore", "interested", "accepted", "rejected"],
        message: "{VALUE} is not allowed for status",
      },
    },
  },
  { timestamps: true }
);

// Adding the compound index
ConnectionRequestSchema.index({ senderUserId: 1, receiverUserId: 1 });

ConnectionRequestSchema.pre("save", function (next) {
  const connectRequest = this;

  if (connectRequest.senderUserId.equals(connectRequest.receiverUserId)) {
    throw new Error("You cannot send the Request to yourself");
  }

  next();
});

module.exports = mongoose.model("ConnectionRequest", ConnectionRequestSchema);
