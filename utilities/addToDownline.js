const User = require("../models/userModel");
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
        const instantCashBackLevel = userPackage.instantCashBack.find(
            cashbackObj => cashbackObj.level === level
        );
        const instantCashBackBonus = activationFee * instantCashBackLevel.bonusPercentage / 100;
        const referralBonusAmount = activationFee * 0.25; // 25% of the activation fee


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
        const upline = await User.findById(uplineID);

        //if upline Exist, add user to upline's downline
        if (upline?.upline) {
            await addToDownline(username, upline.upline.ID, userId, selectedPackage._id, selectedPackage.name, level + 1, userPv);
        }
    } catch (error) {
    }
};

module.exports = addToDownline;
