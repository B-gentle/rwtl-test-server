const asyncHandler = require("express-async-handler")
const User = require("../models/userModel");
const Package = require("../models/packageModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const errorHandler = require("../middleWare/errorMiddleware");


// function to generate referral code
const generateReferralCode = (id, username) => {
    return `REF${id.slice(-5).toUpperCase()}${username}`;
};

// function to generate referral link
const generateReferralLink = (referralCode) => {
    return `https://rechargewise.com/register?ref=${referralCode}`;
};

// function to add user to upline's downline levels deep.
const addToDownline = async (userID, uplineID, level = 1, errorHandler, packageID) => {
    // const existingDownline = await User.findOne({
    //     downlines: { $elemMatch: { username: userID } }
    //   });

    //   if (existingDownline) {
    //       return  (`${userID} is already a downline of another user.`)
    //   }

    // Check if user is already an existing downline of the upline
    //   const upline = await User.findById(uplineID);
    //   const existingUplineDownline = upline.downlines.find(downline => downline.username === userID);

    //   if (existingUplineDownline) {
    //      return (`${userID} is already a downline of the upline.`)
    //   }
    try {
        const selectedPackage = await Package.findById(packageID);
        const activationFeeLevel = selectedPackage.referralBonusLevel; // Retrieve the activation fee level from the selected package
        const activationFee = selectedPackage.amount;
        const referralBonusAmount = activationFee * 0.25; // 25% of the activation fee

        // add user to upline's downline and calculate referral bonus
        await User.updateOne(
            { _id: uplineID },
            {
                $addToSet: {
                    downlines: { username: userID, level },
                },
            }
        );

        // Stop giving upline bonus if the referralBonusLevel is reached
        if (level < selectedPackage.referralBonusLevel && level < selectedPackage.referralBonusLevel) {
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
        }
        // get upline's upline
        const upline = await User.findById(uplineID).select("uplineID");

        // if upline exists and referralBonusLevel is not reached, add user to upline's downline
        if (upline.uplineID && level <= selectedPackage.referralBonusLevel) {
            console.log(upline.uplineID);
            await addToDownline(userID, upline.uplineID, level + 1, errorHandler, selectedPackage);
        }

    } catch (error) {
        console.error(error);
        errorHandler(error)
    }
}

const calculateUplineBonuses = (paidAmount) => {
    const generations = [{
        generation: "firstGeneration",
        percentage: 25
    },
    {
        generation: "secondGeneration",
        percentage: 6
    },
    {
        generation: "thirdGeneration ",
        percentage: 5
    },
    {
        generation: "fourthGeneration",
        percentage: 2
    },
    {
        generation: "fifthGeneration",
        percentage: 1.5
    },
    {
        generation: "sixthGeneration",
        percentage: 1.5
    },
    {
        generation: "seventhGeneration",
        percentage: 1
    },
    {
        generation: "eighthGeneration",
        percentage: 1
    },
    {
        generation: "ninthGeneration",
        percentage: 1
    },
    {
        generation: "tenthGeneration",
        percentage: 1
    }
    ]

    const bonuses = generations.map((generation, index) => {
        const bonusAmount = Math.round(paidAmount * (generation.percentage / 100));
        return {
            generation: generation.generation,
            bonusAmount
        }
    }

    )
    return bonuses;
}

const registerUser = asyncHandler(async (req, res) => {
    const {
        fullName,
        username,
        email,
        password,
        phoneNo,
        package,
        accountNo,
        accountName,
        bankName,
        referralCode,
    } = req.body;

    //validation 
    // if (accountNo.length < 10) {
    //     res.status(400)
    //     throw new Error("Please enter a valid account number")
    // }

    //check if user exist
    const userExist = await User.findOne({
        username
    })
    if (userExist) {
        res.status(404)
        throw new Error("username already exist")
    }

    //selected package
    const selectedPackage = await Package.findById(package);

    //getting all bonuses to be paid to the upline
    // const uplineBonuses = calculateUplineBonuses(selectedPackage.amount)

    if (!selectedPackage) {
        res.status(404)
        throw new Error("package does not exist")
    }

    //check if upline exist
    const upline = await User.findOne({
        referralCode
    })

    if (!upline) {
        res.status(404)
        throw new Error("username not found")
    }

    //hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    req.body.password = hashedPassword;

    //create new user
    const user = new User({
        email,
        fullName,
        username,
        password: hashedPassword,
        phoneNo,
        package: selectedPackage.name,
        accountNo,
        accountName,
        bankName,
        referralCode,
        uplineID: upline._id,
        // paidAmount: selectedPackage.amount,
        // uplineBonus: uplineBonuses
    })


    const {
        _id
    } = user;
    const stringId = _id.toString();

    //generate referral code and links
    user.referralCode = generateReferralCode(stringId, user.username);
    user.referralLink = generateReferralLink(user.referralCode)
    //add upline
    user.upline = upline.username;

    // change from default free user
    user.isFreeUser = selectedPackage ? false : true;

    await user.save();

    // Add user to upline's downline
    try {
        const initialLevel = 1
        await addToDownline(user.username, upline._id, initialLevel, errorHandler, selectedPackage._id);
    } catch (error) {

        res.status(400).json({ error: error.message });
        return; // Stop the execution if an error occurs
    }

    res.status(201).json({
        _id,
        username
    });
})

const loginUser = async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        res.status(404)
        throw new Error("Enter username or password")
    }
    try {
        //check if user exist
        const user = await User.findOne({
            username
        })
        if (!user) {
            res.status(400);
            throw new Error("user does not exist")
        }

        //check if password is correct
        const passwordIsCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!passwordIsCorrect) {
            throw new Error("Invalid Password")
        }

        //create and assign token
        const token = jwt.sign({
            userId: user._id
        }, process.env.jwtSecret, {
            expiresIn: "1d"
        });
        res.status(200).json({
            data: token
        })

    } catch (error) {
        res.status(400)
    }
}

module.exports = {
    registerUser,
    loginUser,
}