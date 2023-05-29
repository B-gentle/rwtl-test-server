const User = require("../models/userModel")

const addToDownline = async (username, uplineID, userId, level = 1) => {
    try {
        // add user to upline's downline
        await User.updateOne({
            _id: uplineID
        }, {
            $addToSet: {
                downlines: {
                    userId,
                    username,
                    level,
                }
            }
        });

        const user = await User.findById(userId).populate("package");
        const userPackageLevel = user.package.referralBonusLevel;

        // Stop giving upline bonus if the referralBonusLevel is reached
        if (level <= userPackageLevel) {
            // console.log(level);
            await User.updateOne(
                { _id: uplineID },
                {
                    $push: {
                        uplineBonus: {
                            generation: `Generation ${level}`,
                            bonusAmount: referralBonusAmount,
                        },
                    },
                    $inc: { referralBonus: referralBonusAmount }, // Increment referralBonus by referralBonusAmount
                }
            );
        } else {
            await User.updateOne(
                { _id: uplineID },
                {
                    $push: {
                        uplineBonus: {
                            generation: `Generation ${level}`,
                            bonusAmount: 0,
                        },
                    },
                }
            );
        }

        // get upline's upline
        const upline = await User.findById(uplineID)


        //if upline Exist, add user to upline's downline
        if (upline?.upline) {
            await addToDownline(username, upline.upline.ID, userId, level + 1)
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = addToDownline