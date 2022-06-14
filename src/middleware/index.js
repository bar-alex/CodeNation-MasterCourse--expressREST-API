const bcrypt = require("bcryptjs");
const { getUserPassword } = require('../user/utils');
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


// will verify the password stored against the old_password provided
exports.verifyPassword = async (req, res, next) => {
    try {
        console.log('->verifyPassword started and getUserPassword is ',getUserPassword);

        // const providedPassword = req.body.old_password && await bcrypt.hash(req.body.old_password, 8);
        const providedPassword = req.body.old_password;
        const storedPasswordHash = await getUserPassword(req.body.username);   // might return null if problems with username
        
        if (!storedPasswordHash || typeof storedPasswordHash!=="string") 
            next( new Error("verifyPassword->Error: retrieving stored password") );

        const passComparison = await bcrypt.compare(providedPassword, storedPasswordHash);

        console.log('->verifyPassword:'
            ,'\nstoredPass: ', storedPasswordHash
            ,'\ngiven-Pass: ',providedPassword
            ,'\ncomparison: ',passComparison);

        // req.body._passwordValidated = ( providedPassword === storedPasswordHash )
        if ( !passComparison )
            next( new Error("verifyPassword->Error: password does not match") );

        // everything's ok, move along
        next();

    } catch (error) {
        console.log(error);
        next(error);
    }
};


exports.tokenCheck = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        console.log(token);
        const decodedToken = jwt.verify(token, process.env.SECRET);
        console.log(decodedToken);
        const user = await User.findById( decodedToken.id );
        console.log(user);
        req.loggedUser = user // will be passed along to the controller

    } catch (error) {
        console.log(error);
        res.send({error: error.code});
    }
}


exports.unHash = async (req,res,next) => {
    try {
        const user = await User.findOne({username: req.body.username});
        const result = await bcrypt.compare( req.body.password, user.password );
        if (!result)
            throw new Error("Passwords do not match")
        next()            
    } catch (error) {
        console.log(error);
        res.send({error: error.code})
    }
}


exports.login = (req,res,next) => {

}