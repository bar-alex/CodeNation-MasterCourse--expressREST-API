const {
    Router
} = require("express");
const {
    createUser,
    getUsers,
    deleteUser,
    updateUser,
    sendToken
} = require("./controllers");
const {
    hashPassword,
    tokenCheck,
    comparePassword,
    isUserSelfOrAdmin,
    isUserAdmin,
    errMiddleware
} = require("../middleware");
const userRouter = Router();

// create new user // will hash the password before createUser adds it to the database // will return token
userRouter.post("/user", 
    hashPassword, 
    errMiddleware, 
    createUser);

// verifies the user and password are ok and will return a token
userRouter.post("/login", 
    comparePassword, errMiddleware, sendToken)

// will return the list of all users // without the admins if logged-in user is normal // with the admins if logged-in user is admin
userRouter.get("/users", tokenCheck, errMiddleware, getUsers);
// will return the list of admins // logged in user must be an admin
userRouter.get("/users/admin", tokenCheck, isUserAdmin, errMiddleware, getUsers);

// will change information for the provided username
userRouter.put("/user/:username", tokenCheck, isUserSelfOrAdmin, hashPassword, errMiddleware, updateUser)

// will change information for the provided username
userRouter.delete("/user/:username", tokenCheck, isUserSelfOrAdmin, errMiddleware, deleteUser)


module.exports = userRouter;