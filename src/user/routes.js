const { Router } = require("express");
const { createUser, getUsers, deleteUser, updateUser } = require("./controllers");
const { hashPassword, verifyPassword, tokenCheck } = require("../middleware");
const userRouter = Router();

// will hash the password before createUser adds it to the database
userRouter.post("/user", hashPassword, createUser);


userRouter.get("/user", tokenCheck, getUsers);

userRouter.put("/user", verifyPassword, updateUser);
userRouter.patch("/user", verifyPassword, updateUser);

//userRouter.delete("/user",verifyPassword, deleteUser);
userRouter.delete("/user", deleteUser);

module.exports = userRouter;
