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
            const userPackage = await Package.findById(user.package.ID);
            console.log('userPackage:', userPackage);
            const userPackageLevel = userPackage.referralBonusLevel;
            const activationFee = selectedPackage.amount;
            const instantCashBackLevel = userPackage.instantCashBack.find(
                cashbackObj => cashbackObj.level === level
            );
            console.log(instantCashBackLevel)
            const uplineInstantCashBackBonus = activationFee * instantCashBackLevel.bonusPercentage / 100;

            console.log('selectedPackage:', selectedPackage);
            console.log('user:', user);
            console.log('userPackage:', userPackage);
            console.log('userPackageLevel:', userPackageLevel);
            console.log('activationFee:', activationFee);
            // console.log('referralBonusAmount:', referralBonusAmount);
            console.log('instantCashBackLevel:', instantCashBackLevel);
            console.log('uplineInstantCashBackBonus:', uplineInstantCashBackBonus);

            if (level <= userPackageLevel) {
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

    module.exports = addToDownline;
