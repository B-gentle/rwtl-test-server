const mongoose = require('mongoose')
const DataBundle = require('../models/dataPlans')

const dataPlans = [
  {
    network: 'MTN',
    networkCode: '01',
    plans: [
      {
        productCode: 1,
        productName: '50 MB - 30 days (Corporate)',
        productAmount: 14,
        companyPrice: 20,
        difference: 6
      },
      {
        productCode: 2,
        productName: '150 MB - 30 days (Corporate)',
        productAmount: 38,
        companyPrice: 40,
        difference: 2
      },
      {
        productCode: 3,
        productName: '250 MB - 30 days (Corporate)',
        productAmount: 62,
        companyPrice: 70,
        difference: 8
      },
      {
        productCode: 4,
        productName: '500 MB - 30 days (SME)',
        productAmount: 117,
        companyPrice: 120,
        difference: 3
      },
      {
        productCode: 5,
        productName: '500 MB - 30 days (Corporate)',
        productAmount: 122,
        companyPrice: 125,
        difference: 3
      },
      {
        productCode: 6,
        productName: '1 GB - 30 days (SME)',
        productAmount: 230,
        companyPrice: 240,
        difference: 10
      },
      {
        productCode: 7,
        productName: '1 GB - 30 days (Corporate)',
        productAmount: 235,
        companyPrice: 245,
        difference: 10
      },
      {
        productCode: 8,
        productName: '2 GB - 30 days (SME)',
        productAmount: 460,
        companyPrice: 470,
        difference: 10
      },
      {
        productCode: 9,
        productName: '2 GB - 30 days (Corporate)',
        productAmount: 470,
        companyPrice: 480,
        difference: 10
      },
      {
        productCode: 10,
        productName: '3 GB - 30 days (SME)',
        productAmount: 690,
        companyPrice: 700,
        difference: 10
      },
      {
        productCode: 11,
        productName: '3 GB - 30 days (Corporate)',
        productAmount: 705,
        companyPrice: 715,
        difference: 10
      },
      {
        productCode: 12,
        productName: '5 GB - 30 days (SME)',
        productAmount: 1150,
        companyPrice: 1160,
        difference: 10
      },
      {
        productCode: 13,
        productName: '5 GB - 30 days (Corporate)',
        productAmount: 1175,
        companyPrice: 1185,
        difference: 10
      },
      {
        productCode: 14,
        productName: '10 GB - 30 days (SME)',
        productAmount: 2300,
        companyPrice: 2310,
        difference: 10
      },
      {
        productCode: 15,
        productName: '10 GB - 30 days (Corporate)',
        productAmount: 2350,
        companyPrice: 2360,
        difference: 10
      },
      {
        productCode: 16,
        productName: '15 GB - 30 days (Corporate)',
        productAmount: 3460,
        companyPrice: 3470,
        difference: 10
      },
      {
        productCode: 17,
        productName: '20 GB - 30 days (Corporate)',
        productAmount: 4675,
        companyPrice: 4685,
        difference: 10
      },
      {
        productCode: 18,
        productName: '25 GB - 30 days (Corporate)',
        productAmount: 5850,
        companyPrice: 5860,
        difference: 10
      },
      {
        productCode: 19,
        productName: '50 GB - 30 days (Corporate)',
        productAmount: 11625,
        companyPrice: 11635,
        difference: 10
      },
      {
        productCode: 20,
        productName: '750 MB - 14 days (Direct)',
        productAmount: 482.5,
        companyPrice: 500,
        difference: 17.5
      },
      {
        productCode: 21,
        productName: '1 GB - 7 days (Direct)',
        productAmount: 482.5,
        companyPrice: 500,
        difference: 17.5
      },
      {
        productCode: 22,
        productName: '1.5 GB - 30 days (Direct)',
        productAmount: 965,
        companyPrice: 1000,
        difference: 35
      },
      {
        productCode: 23,
        productName: '3 GB - 30 days (Direct)',
        productAmount: 1447.5,
        companyPrice: 1500,
        difference: 52.5
      },
      {
        productCode: 24,
        productName: '4.5 GB - 30 days (Direct)',
        productAmount: 1930,
        companyPrice: 2000,
        difference: 70
      },
      {
        productCode: 25,
        productName: '6 GB - 7 days (Direct)',
        productAmount: 1447.5,
        companyPrice: 1500,
        difference: 52.5
      },
      {
        productCode: 26,
        productName: '6 GB - 30 days (Direct)',
        productAmount: 2412.5,
        companyPrice: 2500,
        difference: 87.5
      },
      {
        productCode: 27,
        productName: '8 GB - 30 days (Direct)',
        productAmount: 2895,
        companyPrice: 3000,
        difference: 105
      },
      {
        productCode: 28,
        productName: '10 GB - 30 days (Direct)',
        productAmount: 3377.5,
        companyPrice: 3500,
        difference: 122.5
      },
      {
        productCode: 29,
        productName: '15 GB - 30 days (Direct)',
        productAmount: 4825,
        companyPrice: 5000,
        difference: 175
      },
      {
        productCode: 30,
        productName: '20 GB - 30 days (Direct)',
        productAmount: 5790,
        companyPrice: 6000,
        difference: 210
      },
      {
        productCode: 31,
        productName: '40 GB - 30 days (Direct)',
        productAmount: 9650,
        companyPrice: 10000,
        difference: 350
      },
      {
        productCode: 32,
        productName: '75 GB - 30 days (Direct)',
        productAmount: 14475,
        companyPrice: 14500,
        difference: 25
      },
      {
        productCode: 33,
        productName: '110 GB - 30 days (Direct)',
        productAmount: 19300,
        companyPrice: 19500,
        difference: 200
      }
    ]
  },
  {
    network: 'AIRTEL',
    networkCode: '04',
    plans: [
      {
        productCode: 1,
        productName: '100 MB - 7 days (SME)',
        productAmount: 25,
        companyPrice: 50,
        difference: 25
      },
      {
        productCode: 2,
        productName: '300 MB - 7 days (SME)',
        productAmount: 71,
        companyPrice: 80,
        difference: 9
      },
      {
        productCode: 3,
        productName: '500 MB - 30 days (SME)',
        productAmount: 117,
        companyPrice: 200,
        difference: 83
      },
      {
        productCode: 4,
        productName: '1 GB - 30 days (SME)',
        productAmount: 225,
        companyPrice: 230,
        difference: 5
      },
      {
        productCode: 5,
        productName: '2 GB - 30 days (SME)',
        productAmount: 450,
        companyPrice: 500,
        difference: 50
      },
      {
        productCode: 6,
        productName: '5 GB - 30 days (SME)',
        productAmount: 1125,
        companyPrice: 1200,
        difference: 75
      },
      {
        productCode: 7,
        productName: '10 GB - 30 days (SME)',
        productAmount: 2250,
        companyPrice: 2300,
        difference: 50
      },
      {
        productCode: 8,
        productName: '15 GB - 30 days (SME)',
        productAmount: 3375,
        companyPrice: 3400,
        difference: 25
      },
      {
        productCode: 9,
        productName: '20 GB - 30 days (SME)',
        productAmount: 4500,
        companyPrice: 4550,
        difference: 50
      },
      {
        productCode: 10,
        productName: '100 MB - 1 day (Direct)',
        productAmount: 95.54,
        companyPrice: 100,
        difference: 4.46
      },
      {
        productCode: 11,
        productName: '200 MB - 3 days (Direct)',
        productAmount: 192.06,
        companyPrice: 200,
        difference: 7.94
      },
      {
        productCode: 12,
        productName: '350 MB - 7 days (Direct)',
        productAmount: 288.55,
        companyPrice: 300,
        difference: 11.45
      },
      {
        productCode: 13,
        productName: '750 MB - 14 days (Direct)',
        productAmount: 481.54,
        companyPrice: 500,
        difference: 18.46
      },
      {
        productCode: 14,
        productName: '1 GB - 1 day (Direct)',
        productAmount: 288.56,
        companyPrice: 300,
        difference: 11.44
      },
      {
        productCode: 15,
        productName: '1.5 GB - 30 days (Direct)',
        productAmount: 964.04,
        companyPrice: 1000,
        difference: 35.96
      },
      {
        productCode: 16,
        productName: '2 GB - 1 day (Direct)',
        productAmount: 481.56,
        companyPrice: 500,
        difference: 18.44
      },
      {
        productCode: 17,
        productName: '2 GB - 30 days (Direct)',
        productAmount: 1157.04,
        companyPrice: 1200,
        difference: 42.96
      },
      {
        productCode: 18,
        productName: '3 GB - 30 days (Direct)',
        productAmount: 1446.54,
        companyPrice: 1500,
        difference: 53.46
      },
      {
        productCode: 19,
        productName: '4.5 GB - 30 days (Direct)',
        productAmount: 1929.04,
        companyPrice: 2000,
        difference: 70.96
      },
      {
        productCode: 20,
        productName: '6 GB - 7 days (Direct)',
        productAmount: 1446.56,
        companyPrice: 1500,
        difference: 53.44
      },
      {
        productCode: 21,
        productName: '6 GB - 30 days (Direct)',
        productAmount: 2411.54,
        companyPrice: 2500,
        difference: 88.46
      },
      {
        productCode: 22,
        productName: '8 GB - 30 days (Direct)',
        productAmount: 2894.05,
        companyPrice: 3000,
        difference: 105.95
      },
      {
        productCode: 23,
        productName: '11 GB - 30 days (Direct)',
        productAmount: 3859.04,
        companyPrice: 3999,
        difference: 139.96
      },
      {
        productCode: 24,
        productName: '15 GB - 30 days (Direct)',
        productAmount: 4824.04,
        companyPrice: 5000,
        difference: 175.96
      },
      {
        productCode: 25,
        productName: '40 GB - 30 days (Direct)',
        productAmount: 9649.04,
        companyPrice: 10000,
        difference: 350.96
      },
      {
        productCode: 26,
        productName: '75 GB - 30 days (Direct)',
        productAmount: 14474.04,
        companyPrice: 15000,
        difference: 325.96
      },
      {
        productCode: 27,
        productName: '110 GB - 30 days (Direct)',
        productAmount: 19300.04,
        companyPrice: 20000,
        difference: 699.96
      }
    ]
  },
]

DataBundle.insertMany(dataPlans)
  .then(() => {
    console.log('Data bundles inserted successfully')
    process.exit(0)
  })
  .catch(error => {
    console.log('Error adding predefined packages', error)
  })
