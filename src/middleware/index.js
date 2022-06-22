const bcrypt = require("bcryptjs");
// const { getUserPassword } = require('../user/utils');
const jwt = require("jsonwebtoken");
const User = require("../user/model");


// error middleware -- only run by next(error)
exports.errMiddleware = (error, req, res, next) => {
    
    console.log("\n-> Error Handling Middleware called");
    console.log('->   Path: ', req.path);
    console.error('->   Error: ', error);

    // if the error object as a custom status property the use that to send the response
    let statusCode = error.status ? error.status : 500;
    let returnData = error.errorText ? { message: error.errorText } : { name: error.name, message: error.message };
    
    // send the response
    res.status(statusCode).send(returnData);

    // if (error.type == 'redirect')
    //     res.redirect('/error')

    //     else if (error.type == 'time-out') // arbitrary condition check
    //     res.status(408).send(error)
    // else
    //     res.status(500).send(error)
}


// will hash the password
exports.hashPassword = async (req, res, next) => {
    try {
        
        // if there's no password to hash log and carry on
        if ( req.body.password ) {
            const hashedPass = await bcrypt.hash(req.body.password, 8);
            req.body.password = hashedPass;

        } else {
            console.log("-> hashPassword(): req.body.password doesn't exist: ", req.body);
        }

        next();

    } catch (error) {
        console.log(error);
        next(error);
    }
};


// will compare password of { username, password } with the one stored in database if it exits
exports.comparePassword = async (req,res,next) => {
    try {
        const user = await User.findOne({username: req.body.username});
        const result = await bcrypt.compare( req.body.password, user.password );
        if (!result)
            throw new Error("Passwords do not match")
        next();
    } catch (error) {
        console.log('-> comparePassword, error: ', error);
        error.status = 401;
        error.errorText = "Provided password is incorrect"
        next(error);
    }
};


// will verify the token exists and will add a user object for the user of the token to the req 
exports.tokenCheck = async (req, res, next) => {
    try {
        // get token from header
        const token = req.header("Authorization");
        console.log('-> tokenCheck, token: ', token);
        // if token not provided throw an error
        if(!token) throw new Error("Authorization header doesn't have a token");
        // decode the token and get an object with id property which has the value of the user id
        const decodedToken = jwt.verify(token, process.env.SECRET);
        console.log('-> tokenCheck, decodedToken: ', decodedToken);
        // assign the user ot the request
        req.user = await User.findById( decodedToken.id );
        console.log('-> tokenCheck, user found: ', req.user);
        if (!req.user) throw new Error("User wasn't found for the tokenized id");
        // exit middleware
        next()
    } catch (error) {
        console.log('-> tokenCheck, error: ', error);
        error.status = 401;
        error.errorText = "Authorization token is invalid: "+error.message;
        next(error);
        // res.send({error: error.code});
        // throw error;
    }
};


// will validate that the user is self or admin
exports.isUserSelfOrAdmin = async (req, res, next) => {
    try {
        if(!req.user) throw new Error("user object is not attached to req")
        
        // token must belong to an admin or to the user provided as a parameter
        if( req.user.is_admin || req.user.username === req.params.username )    // || req.user.username === req.body.username
            next()
        else 
            throw new Error("tokenized user is not owner nor an admin")
            // next( "tokenized user is not admin and it doesn't own the user details" )

    } catch (error) {
        console.log('-> isUserSelfOrAdmin, error: ', error.code, error);
        // res.send({error: error.code});
        error.status = 403;
        error.errorText = "Tokenized user is not an admin nor authorized for the operation"
        next(error);
    }
};


// will validate that the user is admin
exports.isUserAdmin = async (req, res, next) => {
    try {
        if(!req.user) throw new Error("user object is not attached to req")
        
        if( req.user.is_admin )
            next()
        else 
            throw new Error("tokenized user is not admin")

    } catch (error) {
        console.log('-> isUserAdmin, error: ', error.code, error);
        // res.send({error: error.code});
        error.status = 403;
        error.errorText = "Tokenized user is not an admin"
        next(error);
    }

};
