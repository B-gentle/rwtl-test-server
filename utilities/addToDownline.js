const User = require("../models/userModel")
const Package = require("../models/packageModel");

const addToDownline = async (username, uplineID, userId, packageID, packageName, level = 1, userPv) => {
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
                    pv: userPv,
                    package: {
                        name: packageName
                    }
                }
            }
        });

        const selectedPackage = await Package.findById(packageID);
        const user = await User.findById(userId).populate("package");
        const userPackage = await Package.findById(user.package.ID);
        const userPackageLevel = userPackage.referralBonusLevel;
        const activationFee = selectedPackage.amount;
        const referralBonusAmount = activationFee * 0.25; // 25% of the activation fee

        console.log("New User here");
        console.log(username);
        console.log(uplineID);
        console.log(userId);
        console.log(packageID);
        console.log(packageName);
        console.log(level);
        console.log(userPv);
        console.log(selectedPackage);
        console.log(user);
        console.log(userPackage);
        console.log(userPackageLevel);
        console.log(activationFee);
        console.log(referralBonusAmount);

        // Stop giving upline bonus if the referralBonusLevel is reached
        if (level == 1) {
            await User.updateOne(
                { _id: uplineID },
                {
                    $addToSet: {
                        directReferral: {
                            userId,
                            username,
                            pv: userPv,
                            package: packageName
                        }
                    }
                }
            )
        } else {
            await User.updateOne(
                { _id: uplineID },
                {
                    $push: {
                        indirectReferral: {
                            userId,
                            username,
                            pv: userPv,
                            level,
                            package: packageName
                        }
                    }
                }
            )
        }

        if (level <= userPackageLevel) {
            await User.updateOne(
                { _id: uplineID },
                {
                    $push: {
                        uplineBonus: {
                            generation: `Generation ${level}`,
                            bonusAmount: referralBonusAmount,
                        },
                    },
                    $inc: {
                        referralBonus: referralBonusAmount,
                        pv: userPv
                    }, // Increment referralBonus by referralBonusAmount
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
                    $inc: { pv: userPv },
                }
            );
        }

        // get upline's upline
        const upline = await User.findById(uplineID)


        //if upline Exist, add user to upline's downline
        if (upline?.upline) {
            await addToDownline(username, upline.upline.ID, userId, selectedPackage._id, selectedPackage.name, level + 1, userPv)
        }
    } catch (error) {
    }
}

module.exports = addToDownline

module.exports = addToDownline