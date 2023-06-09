const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    transactionId: {
      type: String,
      required: [true, 'Please add a transaction ID']
    },
    transactionType: {
      type: String,
      required: true,
      enum: [
        'airtime',
        'data',
        'cableTv',
        'exams',
        'transfer',
        'crediting',
        'withdrawal',
      ]
    },
    transactionCategory: {
      type: String,
      required: true,
      enum: ['credit', 'withdrawal', 'debit'],
      default: function () {
        if (this.transactionType === 'crediting') {
          return 'credit'
        } else if (this.transactionType === 'withdrawal') {
          return 'withdrawal'
        }
      }
    },
    time: {
      type: Date,
      default: Date.now
    },
    commission: {
      type: Number,
      required: true
    },
    status: {
      type: String
    },
    phoneNumber: {
      type: String,
      required: function () {
        return (
          this.transactionType === 'airtime' || this.transactionType === 'data'
        )
      }
    },
    IUC: {
      type: String,
      required: function () {
        return this.transactionType === 'cableTv'
      }
    },
    network: {
      type: String,
      required: function () {
        return (
          this.transactionType === 'airtime' || this.transactionType === 'data'
        )
      }
    },
    cableCompany: {
      type: String,
      required: function () {
        return this.transactionType === 'cableTv'
      }
    },
    amount: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction
