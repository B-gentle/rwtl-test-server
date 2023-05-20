const mongoose = require("mongoose");
const Package = require("../models/packageModel");

//  this is the code for adding packages to our database.
// const insertPackages = require("./middleWare/insertPackages")

const packages = [
  { name: 'Executive Plantinum', amount: 200000, pv: 400, instantCashBack: 50000, referralBonusLevel: 10 },
  { name: 'Plantinum', amount: 100000, pv: 200, instantCashBack: 25000, referralBonusLevel: 9 },
  { name: 'Gold', amount: 50000, pv: 100, instantCashBack: 12500, referralBonusLevel: 8 },
  { name: 'Silver', amount: 20000, pv: 40, instantCashBack: 5000, referralBonusLevel: 7 },
  { name: 'Bronze', amount: 10000, pv: 20, instantCashBack: 2500, referralBonusLevel: 6 },
  { name: 'Basic', amount: 5000, pv: 10, instantCashBack: 1250, referralBonusLevel: 5 },
]

// Update referral bonus to be 25% of the activation fee
const updatedPackages = packages.map(package => {
  const referralBonus = package.amount * 0.25;
  return { ...package, referralBonus };
});

Package.insertMany(packages).then(() => {
  console.log('Predefined packages added successfully');
  process.exit(0)
}).catch((error) => {
  console.log('Error adding predefined packages', error);
});