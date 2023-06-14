const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
  fullname: {
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
    unique: true,
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
    name: {
      type: String,
      ref: "Package",
    },
    ID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package"
    }
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
    type: String,
    unique: true
  },

  downlines: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, },
      username: { type: String, ref: "User" },
      level: { type: Number },
      pv: { type: Number },
      package: {
        name: {
          type: String,
          ref: "Package",
        },
        ID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Package"
        }
      },
    },
  ],

  upline: {
    username: {
      type: String,
      ref: "User",
    },
    ID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },


  referralBonus: {
    type: Number,
    default: 0,
  },

  pv: {
    type: Number,
    default: 0
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

  walletBalance:{
    type: Number,
    default: 0.00
  },
  
  instantCashBack: {
    type: Number,
    default: 0
  },

  directReferral: {
    userId: { type: mongoose.Schema.Types.ObjectId, },
    username: { type: String, ref: "User" },
    pv: { type: Number },
    package: {type: String}
  },

  indirectReferral: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, },
      username: { type: String, ref: "User" },
      pv: { type: Number },
      level: {type: Number},
      package: {type: String}
    }
  ],

  userTransactionPercent: {
    type: Number,
    default: 40
  }

}, {
  timestamps: true
});

// Encrypt the password before saving it
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }
  //hash user password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
})

const User = mongoose.model("User", userSchema);
module.exports = User;