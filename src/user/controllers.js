// require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./model");


// will add the user to the database
exports.createUser = async (req, res) => {
    try {
        console.log('\n-> createUser(), ',
            '\n->   req.params: ', req.params,
            '\n->   req.query: ', req.query,
            '\n->   req.route.path: ',req.route.path,
            '\n->   req.body: ',req.body);

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
        console.log('\n-> getUsers, ',
            '\n->   req.params: ', req.params,
            '\n->   req.query: ',req.query,
            '\n->   req.route.path: ',req.route.path);
        // builds filters to use in find()
        const condText = 
            // if there's a username as a parameter then will make that the condition to return that user's data
            (req.params.username)               ? { username: req.params.username } :
            // user is not admin, will retrieve only normal users
            (!req.user.is_admin)                ? {$or: [{is_admin: false},{is_admin: {$exists:false}}]} :
            // user is admin and the request was to only show admins
            (req.route.path === '/users/admin')  ? {is_admin: true} :
            // user is admin, so retrieve everything
            {};
        
        const userList = await User.find( condText );
        
        console.log('\n-> getUsers, condText: ', condText, 'userList: ');
        // console.table( userList.map( x => { return {username: x._doc.username, email: x._doc.email, password: x._doc.password} } ) );
        console.table( userList.map( ({_doc:it}) => { return {username: it.username, email: it.email, is_admin: it.is_admin, is_disabled: it.is_disabled, password: it.password} } ) );

        // send back a list of the users with the useful properties
        res.send( userList.map( ({_doc:it}) => {delete it.password; delete it.__v; return it} ) )

    } catch (error) {
        console.log('\n-> getUsers, error: ', error);
        res.status(500).send(error);
        // res.send({error: error.code});
    }
};


// will delete the specified user from the database
exports.deleteUser = async (req, res) => {
    try {
        console.log('\n-> deleteUser(), ',
            '\n->   req.params: ', req.params,
            '\n->   req.query: ', req.query,
            '\n->   req.route.path: ',req.route.path,
            '\n->   req.body: ',req.body);

            const result = await User.deleteOne( {username: req.params.username } ); // returns '1': deleted a doc, '0': nothing matched
            console.log(`\n-> deleteUser, result: `, result);

            if (result.deletedCount === 1) 
                res.send( {message: `user ${req.params.username} was deleted`} )
            else 
                res.status(404).send( {message: `username ${req.params.username} was not found in database`} )

    } catch (error) {
        console.log('\n-> deleteUser, error: ', error);
        res.status(500).send(error);
        // res.send({error: error.code});
    }
};


// will update user data, just -> password and or email
exports.updateUser = async (req, res) => {
    try {
        console.log('\n-> updateUser(), ',
            '\n->   req.params: ', req.params,
            '\n->   req.query: ', req.query,
            '\n->   req.route.path: ',req.route.path,
            '\n->   req.body: ',req.body);

        // create object to be used in the update
        const userObj = {};
        if (req.body.email) userObj.email = req.body.email;
        if (req.body.password) userObj.password = req.body.password;

        // object doesn't contain any properties to be used in the update
        if ( !Object.keys(userObj).length ) throw new Error(`no data was provided to update`)
        
        console.log('-> updateUser, userObj: ',userObj);
        // the update command, returns the upadted document
        const updatedDoc = await User.findOneAndUpdate( 
                { username: req.params.username }, 
                { $set: userObj }, 
                { new: true, } 
            ).select('-__v');

        console.log('-> updateUser, updatedDoc: ', updatedDoc);

        res.send( updatedDoc )

    } catch (error) {
        console.log('\n-> updateUser, error: ', error);
        res.status(500).send( {name: error.name, message: error.message} );
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