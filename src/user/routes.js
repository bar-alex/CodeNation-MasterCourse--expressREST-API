const { Router } = require("express");
const { createUser, getUsers, deleteUser, updateUser, sendToken } = require("./controllers");
const { hashPassword, tokenCheck, comparePassword, updateBySelfOrAdmin } = require("../middleware");
const userRouter = Router();

// create new user // will hash the password before createUser adds it to the database // will return token
userRouter.post("/user", hashPassword, createUser);

// verifies the user and password are ok and will return a token
userRouter.post("/login", comparePassword, sendToken)

// will return the list of users
userRouter.get("/user", tokenCheck, getUsers);

// will update the user data -- should check that the token is for admin or for the user
userRouter.put("/user", tokenCheck, updateBySelfOrAdmin, updateUser);

//userRouter.delete("/user",verifyPassword, deleteUser);
// userRouter.delete("/user", deleteUser);

module.exports = userRouter;
