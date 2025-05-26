const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    senderUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    receiverUserId: {
      type: mongoose.Schema.Types.ObjectId,
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
connectionRequestSchema.index({ senderUserId: 1, receiverUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  const connectRequest = this;

  if (connectRequest.senderUserId.equals(connectRequest.receiverUserId)) {
    throw new Error("You cannot send the Request to yourself");
  }

  next();
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
