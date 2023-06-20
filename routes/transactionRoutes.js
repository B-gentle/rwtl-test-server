const express = require("express");
const { purchaseAirtime, walletTransfer, purchaseData } = require("../controllers/transactionController");
const protect = require("../middleWare/authMiddleware");
const router = express.Router();

router.post("/purchaseairtime", protect, purchaseAirtime);
// router.post("/purchasedata", protect, purchaseData);
router.post("/walletTransfer", protect, walletTransfer);

module.exports = router;