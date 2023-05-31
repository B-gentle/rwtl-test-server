const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const User = require("../models/userModel.js");

const protect = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401)
            throw new Error("Not Authorized, please login")
        }

        // verify the token
        const decryptedToken = jwt.verify(token, process.env.jwtSecret)
        // get user id from token
        const user = await User.findById(decryptedToken.id).select("-password")
            .populate('downlines.package.ID', 'name')
        if (!user) {
            res.status(401)
            throw new Error("user not found")
        }
        
        // Log the names of each package in the downlines array
        user.downlines.forEach((downline) => {
            console.log(downline.package.name);
        });

        req.user = user
        next();
    } catch (error) {
        res.status(401)
        throw new Error("Not Authorized, please login")
    }
});


module.exports = protect;