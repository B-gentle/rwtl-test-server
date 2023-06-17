const mongoose = require("mongoose");

const packageSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    pv: {
        type: Number,
        required: true
    },

    instantCashBack: {
        type: Number,
        default: 0.25,
    },

    referralBonusLevel: {
        type: Number,
        required: true
    },

    transaction: {
        level: {
            type: Number,
            required: true
        },
        percentage: {
            type: Number,
            required: true
        }
    }
}, {
    timestamps: true
})

const Package = mongoose.model("Package", packageSchema)
module.exports = Package;