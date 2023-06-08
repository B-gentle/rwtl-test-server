const asyncHandler = require('express-async-handler')
const Transaction = require('../models/transactionModel')
const axios = require('axios')
const User = require('../models/userModel')

const purchaseAirtime = asyncHandler(async (req, res) => {
  const { network, phoneNumber, amount, transactionId } = req.body

  // validate data
  if (!network || !phoneNumber || !amount) {
    res.status(400)
    throw new Error('Please fill in all fields')
  }

  //perform the transaction
  const CKuserId = process.env.CLUB_KONNECT_USER_ID
  const apiKey = process.env.CLUB_KONNECT_API_KEY
  // const port = 5000
  const apiUrl = `${process.env.CLUB_KONNECT_AIRTIME_URI}?UserID=${CKuserId}&APIKey=${apiKey}&MobileNetwork=${network}&MobileNumber=${phoneNumber}&Amount=${amount}&RequestID=${transactionId}`

  // Make api request to buy recharge card
  const response = await axios.post(apiUrl)
  // Check if the api request was successful
  if (response.status === 200) {
    // Calculate the bonus amount (4% of the recharge card amount)
    const bonusAmount = (amount * 0.04).toFixed(2)

    // Add the bonus amount to the user's balance
    const user = await User.findById(user_Id)
    user.commissionBalance += bonusAmount
    await user.save()

    res.status(200).json({
      message: 'Recharge card purchased successfully',
      bonusAmount
    })
  } else {
    res.status(400).json({
      message: response.data,
      error: 'Failed to purchase recharge card'
    })
  }

  //save the transaction to the database
  const successful = new Transaction({
    user: req.user.id,
    status: 'Successful'
  })

  const savedTransaction = await successful.save()
})

const walletTransfer = asyncHandler(async (req, res) => {
  const { senderUsername, recipientUsername, amount } = req.body

  try {
    // Find the sender user and update the wallet balance
    const senderUser = await User.findOneAndUpdate(
      { username: senderUsername },
      { $inc: { walletBalance: -amount } }, // Decrement the sender's balance
      { new: true } // Return the updated document
    )

    if (!senderUser) {
      return res.status(404).json({ error: 'Sender user not found.' })
    }

    // Check if the sender has sufficient balance
    if (senderUser.walletBalance < 0) {
      return res.status(400).json({ error: 'Insufficient balance.' })
    }

    // Find the recipient user and update the wallet balance
    const recipientUser = await User.findOneAndUpdate(
      { username: recipientUsername },
      { $inc: { walletBalance: amount } }, // Increment the recipient's balance
      { new: true } // Return the updated document
    )

    if (!recipientUser) {
      return res.status(404).json({ error: 'Recipient user not found.' })
    }

    // Create a new transaction record for the transfer
    const transaction = new Transaction({
      user: senderUser._id,
      transactionId: 'your_transaction_id', // Replace with actual transaction ID
      transactionType: 'transfer',
      transactionCategory: 'credit',
      commission: 0, // Set the commission value accordingly
      status: 'completed',
      amount: amount
    })

    await transaction.save()

    res.json({ message: 'Funds transferred successfully.' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred.' })
  }
})

module.exports = {
  purchaseAirtime,
  walletTransfer
}
