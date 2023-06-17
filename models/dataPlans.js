const mongoose = require('mongoose')

const dataPlanSchema = new mongoose.Schema({
  network: {
    type: String,
    required: true
  },
  networkCode: {
    type: String,
    required: true
  },
  plans: [
    {
      productCode: {
        type: Number,
        required: true
      },
      productName: {
        type: String,
        required: true
      },
      productAmount: {
        type: Number,
        required: true
      },
      companyPrice: {
        type: Number,
        required: true
      },
      difference: {
        type: Number,
        required: true
      }
    }
  ]
})

const DataPlan = mongoose.model('DataPlan', dataPlanSchema)

module.exports = DataPlan
