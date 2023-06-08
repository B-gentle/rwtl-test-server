const express = require("express");
const { purchaseAirtime } = require("../controllers/transactionController");
const protect = require("../middleWare/authMiddleware");
const router = express.Router();

router.post("/purchaseairtime", protect, purchaseAirtime);

module.exports = router;