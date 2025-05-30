const validator = require("validator");

const validationSignup = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  console.log(password);

  if (!firstName || !lastName) {
    throw new Error("Name is required");
  } else if (firstName.length < 4 || lastName.length > 50) {
    throw new Error("Name should be in between 4 to 50 characters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Enter a valid emailId");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter the strong password");
  }
};

const validateSignIn = (req) => {
  const { emailId, password } = req.body;

  if (!emailId || !password) {
    throw new Error("userName and password required");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is Incorrect");
  }
};

const userUpdateValidation = (req) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];

  const data = req.body;

  const isAllowed = Object.keys(data).every((key) =>
    allowedFields.includes(key)
  );

  return isAllowed;
};

module.exports = { validationSignup, validateSignIn, userUpdateValidation };
