const express = require("express");
const authRouter = require("./auth");
const profileRouter = require("./profile");
const userRouter = require("./user");
const requestRouter = require("./requests");
const router = express.Router();

const deafultRoutes = [
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/profile",
    route: profileRouter,
  },
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/request",
    route: requestRouter,
  },
];

deafultRoutes.map((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
