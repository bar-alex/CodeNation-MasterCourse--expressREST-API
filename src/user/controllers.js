// require("mongoose");
const User = require("./model");

exports.createUser = async (req, res) => {
    try {
        // console.log(req.body);
        // res.send({message: "End of controller"});
        const userObj = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
        }
        const newUser = await User.create( userObj );
        res.send( newUser )

    } catch (error) {
        console.log(error);
        res.send({error: error});
    }
};