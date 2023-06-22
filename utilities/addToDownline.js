const User = require("../models/userModel");
const Package = require("../models/packageModel");

const addToDownline = async (username, uplineID, userId, packageID, packageName, level = 1, userPv) => {
    try {
        console.log('username:', username);
        console.log('uplineID:', uplineID);
        console.log('userId:', userId);
        console.log('packageID:', packageID);
        console.log('packageName:', packageName);
        console.log('level:', level);
        console.log('userPv:', userPv);

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

        console.log('selectedPackage:', selectedPackage);
        console.log('user:', user);

        // Check if the current downline is a direct downline
        if (level === 1) {
            // Increment directPv for the upline
            await User.updateOne(
                { _id: uplineID },
                { $inc: { directPv: userPv } }
            );
        } else {
            // Increment indirectPv for the upline
            await User.updateOne(
                { _id: uplineID },
                { $inc: { indirectPv: userPv } }
            );
        }
        // get upline's upline
        const upline = await User.findById(uplineID);

        //if upline Exist, add user to upline's downline
        if (upline?.upline) {
            await addToDownline(username, upline.upline.ID, userId, selectedPackage._id, selectedPackage.name, level + 1, userPv);
        }
    } catch (error) {
        console.log('Error:', error);
    }
};


const handleReferralBonus = async (uplineID, level, uplinePackage, activationFee, userPv) => {
    // Find the instantCashBackLevel based on the current level
    const instantCashBackLevel = uplinePackage.uplineBonuses.find(
        cashbackObj => cashbackObj.level === level
    );

    console.log('Instant Cash Back Level:', instantCashBackLevel);

    const uplineInstantCashBackBonus = activationFee * instantCashBackLevel.bonusPercentage / 100;
    console.log('Upline Instant Cash Back Bonus:', uplineInstantCashBackBonus);

    const uplineLevel = uplinePackage.referralBonusLevel;
    console.log('Upline Level:', uplineLevel);

    try {
        if (level <= uplineLevel) {
            await User.updateOne(
                { _id: uplineID },
                {
                    $push: {
                        uplineBonus: {
                            generation: `Generation ${level}`,
                            bonusAmount: uplineInstantCashBackBonus,
                        },
                    },
                    $inc: {
                        referralBonus: uplineInstantCashBackBonus,
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
    } catch (err) {
        console.log('Error: ', err);
    }
}

module.exports = {
    addToDownline,
    handleReferralBonus
};