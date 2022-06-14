// require("mongoose");
const User = require("./model");

exports.getUserPassword = async (userName) => {
    console.log('->getUserPassword() is run with userName: ',userName);
    try {

        if (!userName || typeof userName != "string"  ) 
            throw new Error(`getUserPassword.err -> userName must be string and not empty: "${userName}"`);

        // must be an exact match, but case insensitive
        const condText = {username: RegExp('^'+userName+'$','i')}

        const userList = await User.find( condText );
        
        console.log('->getUserPassword, condText: ',condText, 'userList: ', userList);

        if ( userList.length!==1 )
            throw new Error(`getUserPassword.err -> for the username "${userName}" there must be one record in db: ${userList.length}`);

        // only one element in the array, the object {username, email, password}
        return userList[0].password

    } catch (error) {
        console.log(error);
        return null 
    }
}