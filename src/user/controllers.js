// require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./model");


exports.createUser = async (req, res) => {
    try {

        const userObj = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
        }
        const newUser = await User.create( userObj );
        console.log('\n-> createUser, newUser: ', newUser);

        const token = await jwt.sign({id: newUser._id}, process.env.SECRET);
        console.log(token);

        res.send( {newUser, token} )

    } catch (error) {
        console.log(error);
        res.send({error: error});
    }
};


exports.getUsers = async (req, res) => {
    try {
        // console.log(req.body);
        // res.send({message: "End of controller"});
        const userObj = {
            username: req.body.username,
            email: req.body.email,
            // password: req.body.password,            
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
        console.log(error);
        res.send({error: error});
    }
};


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
        console.log(error);
        res.send({error: error});
    }
};


exports.deleteUser = async (req, res) => {

};



exports.tokenLogin = (req, res) => {
    res.send({user: req.loggedUser})
}