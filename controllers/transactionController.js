const dotenv = require('dotenv').config()
const asyncHandler = require('express-async-handler')
const Transaction = require('../models/transactionModel')
const axios = require('axios')
const User = require('../models/userModel')
const Package = require('../models/packageModel')

// const purchaseAirtime1 = asyncHandler(async (req, res) => {
//   const { network, phoneNumber, amount, transactionId } = req.body;

//   // validate data
//   if (!network || !phoneNumber || !amount) {
//     res.status(400);
//     throw new Error('Please fill in all fields');
//   }

//   const CKuserId = process.env.CLUB_KONNECT_USER_ID;
//   const apiKey = process.env.CLUB_KONNECT_API_KEY;
//   const apiUrl = `${process.env.CLUB_KONNECT_AIRTIME_URI}?UserID=${CKuserId}&APIKey=${apiKey}&MobileNetwork=${network}&MobileNumber=${phoneNumber}&Amount=${amount}&RequestID=${transactionId}`;

//   // Make API request to ClubKonnect to but airtime
//   const response = await axios.post(apiUrl);

//   // Check if the api request was successful
//   if (response.status === 200) {
//     // Calculate the bonus amount (40% of the recharge card amount)
//     const bonusAmount = (amount * 0.4).toFixed(2);

//     // Add the bonus amount to the user's balance
//     const user = await User.findById(req.user.id);
//     user.commissionBalance += bonusAmount;
//     await user.save();

//     // Get the user's package details
//     const package = await Package.findOne({ name: user.package });

//     // Check if the package has transaction levels defined
//     if (package && package.transaction && package.transaction.transactionLevels > 0) {
//       const transactionLevels = package.transaction.transactionLevels;

//       // Traverse upline and calculate bonuses for each level
//       let uplineUser = user;
//       for (let i = 0; i < transactionLevels; i++) {
//         // Check if upline user exists
//         if (!uplineUser.upline) {
//           break; // No more upline to calculate bonuses for
//         }

//         // Find upline user and update their balance with transaction profit
//         const upline = await User.findById(uplineUser.upline);
//         if (upline) {
//           const transactionProfit = package.transaction.transactionProfit;
//           upline.commissionBalance += transactionProfit;
//           await upline.save();
//         }

//         // Move to the next upline user
//         uplineUser = upline;
//       }
//     }

//     res.status(200).json({
//       message: 'Recharge card purchased successfully',
//       bonusAmount,
//     });
//   } else {
//     res.status(400).json({
//       message: response.data,
//       error: 'Failed to purchase recharge card',
//     });
//   }

//   // Save the transaction to the database
//   const successful = new Transaction({
//     user: req.user.id,
//     status: 'Successful',
//   });

//   const savedTransaction = await successful.save();
// });

const purchaseAirtime = asyncHandler(async (req, res) => {
  const { network, phoneNumber, amount, transactionId } = req.body

  // validate data
  if (!network || !phoneNumber || !amount) {
    res.status(400)
    throw new Error('Please fill in all fields')
  }

  const CKuserId = process.env.CLUB_KONNECT_USER_ID
  const apiKey = process.env.CLUB_KONNECT_API_KEY
  const apiUrl = `${process.env.CLUB_KONNECT_AIRTIME_URI}?UserID=${CKuserId}&APIKey=${apiKey}&MobileNetwork=${network}&MobileNumber=${phoneNumber}&Amount=${amount}&RequestID=${transactionId}`

  // Make API request to ClubKonnect
  const response = await axios.post(apiUrl)

  const { status, data } = response

  // Check if the API request was successful
  if (status === 200) {
    let discountRate

    // Determine the discount rate based on the mobile network
    switch (network) {
      case '01':
        discountRate = 3.5
        break
      case '02':
        discountRate = 8
        break
      case '04':
        discountRate = 3.5
        break
      case '03':
        discountRate = 6.5
        break
      default:
        discountRate = 0
    }
    // Calculate the bonus amount (40% of the recharge card amount with discount)
    const bonusAmount = (amount * (discountRate / 100) * 0.4).toFixed(2);

    // Add the bonus amount to the user's balance
    const user = await User.findById(req.user.id)
    user.commissionBalance += Number(bonusAmount)
    await user.save()

    // Get the user's package details
    const userPackage = await Package.findById(user.package.ID)

    // Check if the package has transaction levels defined
    if (
      userPackage &&
      userPackage.transaction &&
      userPackage.transaction.transactionLevels > 0
    ) {
      const transactionLevels = userPackage.transaction.transactionLevels

      // Determine the bonus levels based on the user's package and referralBonusLevel
      const bonusLevels = Math.min(
        transactionLevels,
        userPackage.referralBonusLevel
      )

      // Traverse upline and calculate bonuses for each level
      let uplineUser = user
      for (let i = 0; i < bonusLevels; i++) {
        // Check if upline user exists
        if (!uplineUser.upline) {
          break // No more upline to calculate bonuses for
        }

        // Find upline user and update their balance with transaction profit
        const upline = await User.findById(uplineUser.upline.ID)
        if (upline) {
          const transactionProfit = Number(
            (amount * userPackage.transaction.transactionProfit) / 100
          ).toFixed(2)

          upline.commissionBalance += Number(transactionProfit)
          await upline.save()
        }

        // Move to the next upline user
        uplineUser = upline
      }
    }

    res.status(200).json({
      message: 'Recharge card purchased successfully',
      bonusAmount,
      response
    })
  } else {
    res.status(400).json({
      message: data,
      error: 'Failed to purchase recharge card'
    })
  }
})

const purchaseData = asyncHandler(async (req, res) => {
  const { network, phoneNumber, dataPlan, transactionId } = req.body

  // validate data
  if (!network || !phoneNumber || !dataPlan) {
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

    // If the transaction is successful, create a new credit transaction record for the data purchase
    const transaction = new Transaction({
      user: req.user.id,
      transactionId: transactionId,
      transactionType: 'data',
      commission: bonusAmount,
      status: 'completed',
      dataPlan: dataPlan,
      phoneNumber: phoneNumber,
      network: network
    })
    await transaction.save()

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
    if (senderUser.walletBalance < amount) {
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

    // Create a new credit transaction record for the transfer
    const creditTransaction = new Transaction({
      user: senderUser._id,
      transactionId: 'your_transaction_id', // Replace with actual transaction ID
      transactionType: 'transfer',
      transactionCategory: 'credit',
      commission: 0, // Set the commission value accordingly
      status: 'completed',
      amount: amount
    })

    await creditTransaction.save()

    // Create a new debit transaction record for the sender
    const debitTransaction = new Transaction({
      user: senderUser._id,
      transactionId: 'your_transaction_id', // Replace with actual transaction ID
      transactionType: 'transfer',
      transactionCategory: 'debit',
      commission: 0, // Set the commission value accordingly
      status: 'completed',
      amount: amount
    })

    await debitTransaction.save()

    res.json({ message: 'Funds transferred successfully.' })
  } catch (error) {
    res.status(500).json({ error: 'An error occurred.' })
  }
})

module.exports = {
  purchaseAirtime,
  purchaseData,
  walletTransfer
}
