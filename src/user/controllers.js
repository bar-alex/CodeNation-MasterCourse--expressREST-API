// require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./model");


// will add the user to the database
exports.createUser = async (req, res) => {
    try {
        const userObj = {
            username: req.body.username,
            password: req.body.password,    // already hashed by middleware
            email: req.body.email,
        }

        const newUser = await User.create( userObj );
        console.log('\n-> createUser, newUser: ', newUser);

        const token = jwt.sign({id: newUser._id}, process.env.SECRET);
        console.log('\n-> createUser, token: ', token);

        // sen back the newUser object and the token
        res.send( {newUser, token} )

    } catch (error) {
        console.log('\n-> createUser, error: ', error);
        res.status(500).send(error);
        // res.send({error: error.code});
    }
};


exports.getUsers = async (req, res) => {
    try {
        console.log('-> getUsers, ',
            '\n->   req.params: ', req.params,
            '\n->   req.query: ',req.query,
            '\n->   req.route.path: ',req.route.path,
        );
        // builds filters to use in find()
        const condText = 
            // user is not admin, will retrieve only normal users
            (!req.user.is_amdin)                ? {is_admin: false} :
            // user is admin and the request was to only show admins
            (req.route.path == '/users/admin')  ? {is_admin: true} :
            // user is admin, so retrieve everything
            {};

        // if (!!userObj) 
        //     if (userObj.username && typeof userObj.username === 'string')
        //         condText.username = RegExp( (userObj.username.slice(0,1)==='*' ? userObj.username.slice(1) : '^'+userObj.username),'i')
        //     if (userObj.email && typeof userObj.email === 'string')
        //         condText.email = RegExp( (userObj.email.slice(0,1)==='*' ? userObj.email.slice(1) : '^'+userObj.email),'i')

        //console.log('-> getUsers, condText: ', condText);
        
        const userList = await User.find( condText );
        
        console.log('\n-> getUsers, condText: ', condText, 'userList: ');
        console.table( userList.map( x => { return {username: x._doc.username, email: x._doc.email, password: x._doc.password} } ) );

        res.send( userList )

    } catch (error) {
        console.log('\n-> getUsers, error: ', error);
        res.status(500).send(error);
        // res.send({error: error.code});
    }
};


// will delete the specified user from the database
exports.deleteUser = async (req, res) => {
    try {
        
    } catch (error) {
        console.log('\n-> deleteUser, error: ', error);
        res.status(500).send(error);
        // res.send({error: error.code});
    }
};


// will update user data, just -> password and or email
exports.updateUser = async (req, res) => {
    try {
        console.log('->updateUser() is running.');
        // console.log(req.body);
        // res.send({message: "End of controller"});
        const userObj = {
            username: req.body.username,
            isPassValidated: req.body._passwordValidated,    // added by middleware->verifyPassword()
            email: req.body.email,
            password: req.body.password,            
        }
        
        // builds filters to use in find()
        const condText = {};
        if (!!userObj) 
            if (userObj.username && typeof userObj.username === 'string')
                condText.username = RegExp( (userObj.username.slice(0,1)==='*' ? userObj.username.slice(1) : '^'+userObj.username),'i')
            if (userObj.email && typeof userObj.email === 'string')
                condText.email = RegExp( (userObj.email.slice(0,1)==='*' ? userObj.email.slice(1) : '^'+userObj.email),'i')

        //console.log('-> getUsers, condText: ', condText);
        const userList = await User.find( condText );
        
        console.log('\n-> getUsers, condText: ', condText, 'userList: ');
        console.table( userList.map( x => { return {username: x._doc.username, email: x._doc.email, password: x._doc.password} } ) );

        res.send( userList )

    } catch (error) {
        console.log('\n-> updateUser, error: ', error);
        res.status(500).send(error);
        // res.send({error: error.code});        
    }
};


// will set is_admin to true or false -- only by an admin
exports.setUserAdmin = async (req,rest) => {
    try {
        
    } catch (error) {
        console.log('\n-> setUserAdmin, error: ', error);
        res.status(500).send(error);
        // res.send({error: error.code});        
    }
};


// will set is_enabled to true -- only by an admin
exports.setUserEnabled = async (req,rest) => {
    try {
        // get
    } catch (error) {
        console.log('\n-> setUserEnabled, error: ', error);
        res.status(500).send(error);
        // res.send({error: error.code});        
    }
};


// fir the req.user will generate a token that can be user=d ikn authentications
exports.sendToken = async (req, res) => {
    try {
        // if user object is not in rq then find the user by username
        if(!req.user) req.user = await User.findOne({username: req.body.username});
        // generate the token to send back
        const token = jwt.sign({ id: req.user._id }, process.env.SECRET);
        // send the user and the token
        res.send({ user: req.user, token });    

    } catch (error){
        console.log('\n-> sendToken, error: ', error);
        res.status(500).send(error);
    }
}