const express = require("express");
const { purchaseAirtime, walletTransfer } = require("../controllers/transactionController");
const protect = require("../middleWare/authMiddleware");
const router = express.Router();

router.post("/purchaseairtime", protect, purchaseAirtime);
router.post("/walletTransfer", protect, walletTransfer);

module.exports = router;