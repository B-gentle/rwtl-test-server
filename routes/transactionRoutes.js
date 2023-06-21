const express = require("express");
const { purchaseAirtime, walletTransfer, withdrawCommission } = require("../controllers/transactionController");
const protect = require("../middleWare/authMiddleware");
const router = express.Router();

router.post("/purchaseairtime", protect, purchaseAirtime);
// router.post("/purchasedata", protect, purchaseData);
router.post("/walletTransfer", protect, walletTransfer);
router.post("/withdrawCommission", protect, withdrawCommission);

module.exports = router;