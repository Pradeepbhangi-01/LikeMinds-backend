const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      MaxLength: 100,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      // Validating the Email
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error(value + " is Not Valid Email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(value + " Please enter Strong Password");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      required: true,
    },
    gender: {
      type: String,
      // By Default validate will apply for new documents only
      validate(value) {
        if (!["Male", "Female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://media.licdn.com/dms/image/v2/D5603AQHu-RM0vafEuA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1706523598977?e=1753920000&v=beta&t=D6MaJMEe_oqHh5kiRY8tZIzo_GuzZrG_0ejFaBdvSLU",
    },
    about: {
      type: String,
      default: "This is the default about the user",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
