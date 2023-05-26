const User = require("../models/userModel")

const addToDownline = async(username, uplineID, userId, level = 1 ) => {
try {
    // add user to upline's downline
    await User.updateOne({
        _id: uplineID
    },{
        $addToSet : {
            downlines: {
                userId,
                username,
                level,
            }
        }
    });

    // get upline's upline
    const upline = await User.findById(uplineID)
    

    //if upline Exist, add user to upline's downline
    if(upline?.upline){
        await addToDownline(username, upline.upline.ID, userId, level + 1)
    }
} catch (error) {
    console.log(error)
}
}

module.exports = addToDownline