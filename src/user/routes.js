const { Router } = require("express");
const { createUser } = require("./controllers");
const userRouter = Router();

userRouter.post("/user", createUser);

module.exports = userRouter;
