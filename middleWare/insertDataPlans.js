const mongoose = require('mongoose')
const DataBundle = require('../models/dataPlans')

const dataPlans = [
  {
    network: 'GLO',
    networkCode: '02',
    plans: [
      {
        productCode: 1,
        productName: '200 MB - 14 days (SME)',
        productAmount: 52,
        companyPrice: 55,
        difference: 3
      },
      {
        productCode: 2,
        productName: '500 MB - 30 days (SME)',
        productAmount: 127,
        companyPrice: 130,
        difference: 3
      },
      {
        productCode: 3,
        productName: '1 GB - 30 days (SME)',
        productAmount: 250,
        companyPrice: 255,
        difference: 5
      },
      {
        productCode: 4,
        productName: '2 GB - 30 days (SME)',
        productAmount: 500,
        companyPrice: 500,
        difference: 0
      },
      {
        productCode: 5,
        productName: '3 GB - 30 days (SME)',
        productAmount: 750,
        companyPrice: 750,
        difference: 0
      },
      {
        productCode: 6,
        productName: '5 GB - 30 days (SME)',
        productAmount: 1250,
        companyPrice: 1255,
        difference: 5
      },
      {
        productCode: 7,
        productName: '10 GB - 30 days (SME)',
        productAmount: 2500,
        companyPrice: 2503,
        difference: 3
      },
      {
        productCode: 8,
        productName: '105MB (Direct)',
        productAmount: 92,
        companyPrice: 95,
        difference: 3
      },
      {
        productCode: 9,
        productName: '350MB (Direct)',
        productAmount: 184,
        companyPrice: 200,
        difference: 16
      },
      {
        productCode: 10,
        productName: '1.05GB/1.8GB (Direct)',
        productAmount: 460,
        companyPrice: 500,
        difference: 40
      },
      {
        productCode: 11,
        productName: '2.5GB/3.7GB (Direct)',
        productAmount: 920,
        companyPrice: 1000,
        difference: 80
      },
      {
        productCode: 12,
        productName: '5.8GB/9.5GB (Direct)',
        productAmount: 1840,
        companyPrice: 1990,
        difference: 150
      },
      {
        productCode: 13,
        productName: '7.7GB/12.75GB (Direct)',
        productAmount: 2300,
        companyPrice: 2490,
        difference: 190
      },
      {
        productCode: 14,
        productName: '10GB/17GB (Direct)',
        productAmount: 2760,
        companyPrice: 2990,
        difference: 230
      },
      {
        productCode: 15,
        productName: '13.25GB/19GB (Direct)',
        productAmount: 3680,
        companyPrice: 3990,
        difference: 310
      },
      {
        productCode: 16,
        productName: '18.25/23GB (Direct)',
        productAmount: 4600,
        companyPrice: 4990,
        difference: 390
      },
      {
        productCode: 17,
        productName: '29.5GB/37GB (Direct)',
        productAmount: 7360,
        companyPrice: 7490,
        difference: 130
      },
      {
        productCode: 18,
        productName: '50GB/50GB (Direct)',
        productAmount: 9200,
        companyPrice: 10000,
        difference: 800
      },
      {
        productCode: 19,
        productName: '93GB/93GB (Direct)',
        productAmount: 13800,
        companyPrice: 15000,
        difference: 1200
      },
      {
        productCode: 20,
        productName: '119GB/119GB (Direct)',
        productAmount: 16560,
        companyPrice: 18000,
        difference: 1440
      },
      {
        productCode: 21,
        productName: '138GB/138GB (Direct)',
        productAmount: 18400,
        companyPrice: 20000,
        difference: 1600
      }
    ]
  },
  {
    network: '9MOBILE',
    networkCode: '03',
    plans: [
      {
        productCode: 1,
        productName: '50 MB - 30 days (SME)',
        productAmount: 10,
        companyPrice: 20,
        difference: 10
      },
      {
        productCode: 2,
        productName: '100 MB - 30 days (SME)',
        productAmount: 18,
        companyPrice: 20,
        difference: 2
      },
      {
        productCode: 3,
        productName: '300 MB - 30 days (SME)',
        productAmount: 50,
        companyPrice: 70,
        difference: 20
      },
      {
        productCode: 4,
        productName: '500 MB - 30 days (SME)',
        productAmount: 77,
        companyPrice: 80,
        difference: 3
      },
      {
        productCode: 5,
        productName: '1 GB - 30 days (SME)',
        productAmount: 145,
        companyPrice: 150,
        difference: 5
      },
      {
        productCode: 6,
        productName: '2 GB - 30 days (SME)',
        productAmount: 290,
        companyPrice: 300,
        difference: 10
      },
      {
        productCode: 7,
        productName: '3 GB - 30 days (SME)',
        productAmount: 435,
        companyPrice: 450,
        difference: 15
      },
      {
        productCode: 8,
        productName: '4 GB - 30 days (SME)',
        productAmount: 580,
        companyPrice: 600,
        difference: 20
      },
      {
        productCode: 9,
        productName: '5 GB - 30 days (SME)',
        productAmount: 725,
        companyPrice: 730,
        difference: 5
      },
      {
        productCode: 10,
        productName: '10 GB - 30 days (SME)',
        productAmount: 1450,
        companyPrice: 1500,
        difference: 50
      },
      {
        productCode: 11,
        productName: '15 GB - 30 days (SME)',
        productAmount: 2175,
        companyPrice: 2200,
        difference: 25
      },
      {
        productCode: 12,
        productName: '20 GB - 30 days (SME)',
        productAmount: 2900,
        companyPrice: 3000,
        difference: 100
      },
      {
        productCode: 13,
        productName: '25 GB - 30 days (SME)',
        productAmount: 3625,
        companyPrice: 4000,
        difference: 375
      },
      {
        productCode: 14,
        productName: '500 MB - 30 days (Direct)',
        productAmount: 467.5,
        companyPrice: 500,
        difference: 32.5
      },
      {
        productCode: 15,
        productName: '1.5 GB - 30 days (Direct)',
        productAmount: 935,
        companyPrice: 1000,
        difference: 65
      },
      {
        productCode: 16,
        productName: '2 GB - 30 days (Direct)',
        productAmount: 1122,
        companyPrice: 1300,
        difference: 178
      },
      {
        productCode: 17,
        productName: '4.5 GB - 30 days (Direct)',
        productAmount: 1870,
        companyPrice: 2000,
        difference: 130
      },
      {
        productCode: 18,
        productName: '7 GB - 7 days (Direct)',
        productAmount: 1402.5,
        companyPrice: 1500,
        difference: 97.5
      },
      {
        productCode: 19,
        productName: '11 GB - 30 days (Direct)',
        productAmount: 3740,
        companyPrice: 4000,
        difference: 260
      },
      {
        productCode: 20,
        productName: '15 GB - 30 days (Direct)',
        productAmount: 4675,
        companyPrice: 5000,
        difference: 325
      },
      {
        productCode: 21,
        productName: '40 GB - 30 days (Direct)',
        productAmount: 9350,
        companyPrice: 9500,
        difference: 150
      },
      {
        productCode: 22,
        productName: '75 GB - 30 days (Direct)',
        productAmount: 14025,
        companyPrice: 14100,
        difference: 75
      }
    ]
  }
]

DataBundle.insertMany(dataPlans)
  .then(() => {
    console.log('Data bundles inserted successfully')
    process.exit(0)
  })
  .catch(error => {
    console.log('Error adding predefined packages', error)
  })
