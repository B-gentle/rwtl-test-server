const dotenv = require('dotenv').config()
const asyncHandler = require('express-async-handler')
const Transaction = require('../models/transactionModel')
const axios = require('axios')
const User = require('../models/userModel')
const Package = require('../models/packageModel')
const DataPlan = require('../models/dataPlans')

const currentDate = new Date()
const currentYear = currentDate.getFullYear()
const currentMonth = currentDate.getMonth() + 1 // Adding 1 to get a 1-based month
const currentHour = currentDate.getHours()
const currentMinutes = currentDate.getMinutes()

const purchaseAirtime = asyncHandler(async (req, res) => {
  const { network, phoneNumber, amount } = req.body

  // validate data
  if (!network || !phoneNumber || !amount) {
    res.status(400)
    throw new Error('Please fill in all fields')
  }

  const transactionId =
    req.user.username +
    `${currentYear}${currentMonth}${currentHour}${currentMinutes}`

  // Get the current logged in user
  const user = await User.findById(req.user.id)

  // Check if the user's walletBalance is less than the amount they want to buy
  if (user.walletBalance < amount) {
    res.status(400).json({
      message: 'Insufficient wallet balance',
      error: 'Failed to purchase recharge card'
    });
    return;
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
    const bonusAmount = (amount * (discountRate / 100) * 0.4).toFixed(2)
    user.walletBalance -= amount;
    // Add the bonus amount to the user's balance
    user.commissionBalance += Number(bonusAmount)
    user.withdrawableCommission += Number(bonusAmount)
    await user.save()

    // Get the user's package details
    const userPackage = await Package.findById(user.package.ID)

    // Check if the package has transaction levels defined
    if (
      userPackage &&
      userPackage.transaction &&
      userPackage.transaction.transactionLevels > 0
    ) {
      const transactionLevels = userPackage.transaction.level

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
            (amount * userPackage.transaction.percentage) / 100
          ).toFixed(2)

          upline.commissionBalance += Number(transactionProfit)
          upline.withdrawableCommission += Number(transactionProfit)
          await upline.save()
        }

        // Move to the next upline user
        uplineUser = upline
      }
    }

    res.status(200).json({
      message: 'Recharge card purchased successfully',
      bonusAmount
    })
  } else {
    res.status(400).json({
      message: data,
      error: 'Failed to purchase recharge card'
    })
  }
})

// const purchaseData = asyncHandler(async (req, res) => {
//   const { network, networkPlan, phoneNumber, amount } = req.body
//   console.log('network:', network)
//   console.log('networkPlan:', networkPlan)
//   console.log('phoneNumber:', phoneNumber)
//   console.log('amount:', amount)

//   // Validate data
//   if (!network || !phoneNumber || !networkPlan) {
//     res.status(400)
//     throw new Error('Please fill in all fields')
//   }

//   // Find the data plan from the database
//   const matchingPlan = await DataPlan.findOne({
//     'plans.productCode': networkPlan
//   })
//   console.log('matchingPlan:', matchingPlan)
//   const productName = plan.productName.match(/\d+(\.\d+)?/)[0]

//   console.log(productName)

//   // Check if the requested plan is available
//   if (!matchingPlan) {
//     res.status(400)
//     throw new Error('Selected Plan not available')
//   }

//   const plan = matchingPlan.plans.find(plan => plan.productCode === networkPlan)
//   const profit = plan.difference
//   console.log('plan:', plan)
//   console.log('profit:', profit)

//   const user = await User.findById(req.user.id)
//   // Check if the user has sufficient balance in their wallet
//   if (user.walletBalance < amount) {
//     return res.status(400).json({
//       message: 'Insufficient wallet balance'
//     })
//   }

//   // Calculate the bonus amount based on the profit
//   const bonusAmount = (profit * 0.4).toFixed(2)
//   const transactionId =
//     req.user.username +
//     `${currentYear}${currentMonth}${currentHour}${currentMinutes}`
//   console.log('bonusAmount:', bonusAmount)
//   console.log('transactionId:', transactionId)

//   const CKuserId = process.env.CLUB_KONNECT_USER_ID
//   const apiKey = process.env.CLUB_KONNECT_API_KEY
//   const apiUrl = `${process.env.CLUB_KONNECT_DATA_URI}?UserID=${CKuserId}&APIKey=${apiKey}&MobileNetwork=${network}&DataPlan=${productName}&MobileNumber=${phoneNumber}&RequestID=${transactionId}`
//   console.log('apiUrl:', apiUrl)

//   // Make API request to ClubKonnect
//   const response = await axios.post(apiUrl)
//   console.log('response:', response)

//   const { status, data } = response

//   // Check if the API request was successful
//   if (status === 200) {
//     // Retrieve the user from the database
//     console.log('user:', user)
//     if (!user) {
//       res.status(400)
//       throw new Error('User not found')
//     }

//     // Check if the user's balance is sufficient
//     if (user.walletBalance < amount) {
//       res.status(400)
//       throw new Error('Insufficient balance')
//     }

//     // Deduct the product price from the user's balance
//     user.walletBalance -= amount
//     console.log('user.walletBalance:', user.walletBalance)

//     // Get the user's package transaction level and percentage
//     const userPackage = await Package.findOne({ _id: user.package.ID })
//     console.log('userPackage:', userPackage)
//     const userTransactionLevel = userPackage.transaction.level
//     const userTransactionPercentage = user.userTransactionPercent
//     console.log('userTransactionLevel:', userTransactionLevel)
//     console.log('userTransactionPercentage:', userTransactionPercentage)

//     // Add the bonus amount to the user's balance
//     user.walletBalance += Number(bonusAmount)
//     await user.save()
//     console.log('user.walletBalance (after bonus):', user.walletBalance)

//     // Check if the package has transaction levels defined
//     if (
//       userPackage &&
//       userPackage.transaction &&
//       userPackage.transaction.level > 0
//     ) {
//       const transactionLevels = userPackage.transaction.level
//       console.log('transactionLevels:', transactionLevels)

//       // Determine the bonus levels based on the user's package and referralBonusLevel
//       const bonusLevels = Math.min(
//         transactionLevels,
//         userPackage.referralBonusLevel
//       )
//       console.log('bonusLevels:', bonusLevels)

//       let uplineUser = user
//       for (let i = 1; i <= bonusLevels; i++) {
//         // Check if upline user exists
//         if (!uplineUser.upline) {
//           break // No more upline to calculate bonuses for
//         }

//         // Find upline user and update their balance with transaction profit
//         const upline = await User.findById(uplineUser.upline.ID)
//         console.log('upline:', upline)
//         if (upline) {
//           // Check if the upline user is a basic user
//           if (upline.package.name === 'Basic' && i !== 1) {
//             uplineUser = upline.upline
//             continue
//           }

//           const uplinePercentage = await User.findById(
//             uplineUser.upline.ID
//           ).populate({
//             path: 'package.ID',
//             select: 'transaction.percentage'
//           })
//           console.log('uplinePercentage:', uplinePercentage)

//           const transactionProfit = Number(
//             (profit * uplinePercentage.package.ID.transaction.percentage) / 100
//           ).toFixed(2)
//           console.log('transactionProfit:', transactionProfit)

//           upline.walletBalance += Number(transactionProfit)
//           await upline.save()
//           console.log('upline.walletBalance:', upline.walletBalance)
//         }

//         uplineUser = upline // Move to the next upline user
//       }
//     }

//     // If the transaction is successful, create a new credit transaction record for the data purchase
//     const transaction = new Transaction({
//       user: req.user.id,
//       amount: amount,
//       transactionId: transactionId, // Replace with actual transaction ID
//       transactionType: 'data',
//       commission: bonusAmount,
//       status: 'completed',
//       dataPlan: network,
//       phoneNumber: phoneNumber,
//       network: network
//     })
//     console.log('transaction:', transaction)

//     await transaction.save()

//     res.status(200).json({
//       message: 'Data plan purchased successfully',
//       bonusAmount
//     })
//   } else {
//     res.status(400).json({
//       message: data,
//       error: 'Failed to purchase data plan'
//     })
//   }
// })

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

const withdrawCommission = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  // Find the user by their ID
  const user = await User.findById(req.user.id);

  // Check if the user has enough withdrawableCommission to cover the requested amount
  if (user.withdrawableCommission < amount) {
    return res.status(400).json({
      message: 'Insufficient withdrawable commission.' 
    });
  }

  // Deduct the withdrawn amount from the user's withdrawableCommission and update the walletBalance
  user.withdrawableCommission -= amount;
  user.walletBalance += amount;

  // Save the updated user data
  await user.save();

  res.status(200).json({ message: 'Commission withdrawn to wallet balance successfully.' });
});


module.exports = {
  purchaseAirtime,
  walletTransfer,
  withdrawCommission
}