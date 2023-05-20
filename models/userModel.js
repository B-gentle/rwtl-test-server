const mongoose = require("mongoose");

const uplineBonusSchema = mongoose.Schema({
  generation: {
    type: String,
    required: true,
  },
  bonusAmount: {
    type: Number,
    default: 0,
  },
})

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please Add A Name"],
  },

  username: {
    type: String,
    required: [true, "Please input a username"],
    unique: true,
    trim: true
  },

  email: {
    type: String,
    required: [true, "please add an email"],
    lowercase: true,
    trim: true,
    match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please enter a valid email"]
  },

  phoneNo: {
    type: String,
    required: [true, "please add a phone number"],
  },

  password: {
    type: String,
    required: [true, "Please enter a password"],
    minLength: [6, "Password must be up to 6 characters"],
  },

  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true,
  },

  accountNo: {
    type: String,
    // required: [true, "Please Enter an account Number"],
    maxLength: [10, "Account number cannot exceed 10 digits"],
    trim: true
  },

  accountName: {
    type: String,
    // required: true
  },

  bankName: {
    type: String,
    // required: true
  },

  isFreeUser: {
    type: Boolean,
    default: true
  },

  paidAmount: {
    type: Number,
    // required: true,
  },

  referralCode: {
    type: String,
    unique: true
  },

  referralLink: {
    type: String
  },

  downlines: [
    {
      username: { type: String, unique: true, ref: "User" },
      level: { type: Number},
    },
  ],
  
  upline: {
    type: String,
    ref: "User",
  },

  uplineID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  genealogy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],

  referralBonus: {
    type: Number,
    default: 0,
  },

  uplineBonus: {
    type: [uplineBonusSchema],
    default: []
  },
  
  commissionEarned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Commission",
    // default: 0
  },
  commissionBalance: {
    type: Number,
    default: 0
  },

}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports = User;