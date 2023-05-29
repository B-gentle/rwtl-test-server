const express = require("express");
const { registerUser, loginUser, logout, getLoggedInUser, loginStatus, updateUser, changePassword, resetPassword, forgotPassword, buyRechargeCard } = require("../controllers/userController");
const protect = require("../middleWare/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgotpassword", forgotPassword)
router.put("/resetpassword/:restToken", resetPassword)
router.get("/logout", logout)
router.get("/loginstatus", loginStatus)
router.get("/getuser", protect, getLoggedInUser)
router.patch("/updateuser", protect, updateUser)
router.patch("/changepassword", protect, changePassword)

router.post('/buyrechargecard', buyRechargeCard);


module.exports = router;