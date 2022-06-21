const bcrypt = require("bcryptjs");
// const { getUserPassword } = require('../user/utils');
const jwt = require("jsonwebtoken");
const User = require("../user/model");

// will hash the password
exports.hashPassword = async (req, res, next) => {
    try {

        const hashedPass = await bcrypt.hash(req.body.password, 8);
        console.log('pass vs hashedPass: ', req.body.password, hashedPass );
        console.log(await bcrypt.hash(req.body.password, 8));
        console.log(await bcrypt.hash(req.body.password, 8));
        console.log(await bcrypt.hash(req.body.password, 8));

        req.body.password = hashedPass;
        next();

    } catch (error) {
        console.log(error);
        next();
    }
};


// will compare password of { username, password } with the one stored in database if it exits
exports.comparePassword = async (req,res,next) => {
    try {
        const user = await User.findOne({username: req.body.username});
        const result = await bcrypt.compare( req.body.password, user.password );
        if (!result)
            throw new Error("Passwords do not match")
        next()            
    } catch (error) {
        console.log('-> comparePassword, error: ', error);
        res.send({error: error.code})
    }
};


// will verify the token exists and will add a user object for the user of the token to the req 
exports.tokenCheck = async (req, res, next) => {
    try {
        // get token from header
        const token = req.header("Authorization");
        console.log('-> tokenCheck, token: ', token);
        // if token not provided throw an error
        if(!token) 
            throw new Error("Authorization header doesn't have a token")

        const decodedToken = jwt.verify(token, process.env.SECRET);
        console.log('-> tokenCheck, decodedToken: ', decodedToken);
        // assign the user ot the request
        req.user = await User.findById( decodedToken.id );
        console.log('-> tokenCheck, user found: ', user);
        // exit middleware
        next()
    } catch (error) {
        console.log('-> tokenCheck, error: ', error);
        res.send({error: error.code});
    }
};


// will validate that the user is self or admin
exports.updateBySelfOrAdmin = async (req, res, next) => {
    try {
        if(!req.user) 
            throw new Error("user object is not attached to req")
        
            if( req.user.username === req.body.username || req.user.is_admin )
            next()
        else 
            throw new Error("tokenized user is not admin and it doesn't own the user details")

    } catch (error) {
        console.log('-> tokenCheck, error: ', error);
        res.send({error: error.code});
        
    }

};


// // will verify the password stored against the old_password provided
// exports.verifyPassword = async (req, res, next) => {
//     try {
//         console.log('->verifyPassword started and getUserPassword is ',getUserPassword);

//         // const providedPassword = req.body.old_password && await bcrypt.hash(req.body.old_password, 8);
//         const providedPassword = req.body.old_password;
//         const storedPasswordHash = await getUserPassword(req.body.username);   // might return null if problems with username
        
//         if (!storedPasswordHash || typeof storedPasswordHash!=="string") 
//             next( new Error("verifyPassword->Error: retrieving stored password") );

//         const passComparison = await bcrypt.compare(providedPassword, storedPasswordHash);

//         console.log('->verifyPassword:'
//             ,'\nstoredPass: ',storedPasswordHash
//             ,'\ngiven-Pass: ',providedPassword
//             ,'\ncomparison: ',passComparison);

//         // req.body._passwordValidated = ( providedPassword === storedPasswordHash )
//         if ( !passComparison )
//             next( new Error("verifyPassword->Error: password does not match") );

//         // everything's ok, move along
//         next();

//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// };


// exports.login = (req,res,next) => {
//     try {
        
//     } catch (error) {
//         console.log(error);
        
//     }
// }