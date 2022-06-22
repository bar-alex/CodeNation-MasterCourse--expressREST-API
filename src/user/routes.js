const { Router } = require("express");
const { createUser, getUsers, deleteUser, updateUser, sendToken } = require("./controllers");
const { hashPassword, tokenCheck, comparePassword, isUserSelfOrAdmin, isUserAdmin, errMiddleware } = require("../middleware");
const userRouter = Router();

// create new user // will hash the password before createUser adds it to the database // will return token
userRouter.post("/user", hashPassword, errMiddleware, createUser);

// verifies the user and password are ok and will return a token
userRouter.post("/login", comparePassword, errMiddleware, sendToken)

// will return the list of all users // without the admins if logged-in user is normal // with the admins if logged-in user is admin
userRouter.get("/users", tokenCheck, errMiddleware, getUsers);
// will return the list of admins // logged in user must be an admin
userRouter.get("/users/admin", tokenCheck, isUserAdmin, errMiddleware, getUsers);



// will update the user data -- should check that the token is for admin or for the user
userRouter.put("/user", tokenCheck, isUserSelfOrAdmin, updateUser);


//userRouter.delete("/user",verifyPassword, deleteUser);
// userRouter.delete("/user", deleteUser);

module.exports = userRouter;
