require('dotenv').config()

const mongoose = require("mongoose")
const faker = require("faker")
const userModel = require("./user")
const productModel = require("../Product/product")

// mongoose
//   .connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true })
//   .then(x => { console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)})
//   .catch(err => { console.error('Error connecting to mongo', err)});

// const randInt = (min, max) => parseInt(Math.random() * (max - min) + min)

const fillProductByUser = async(user) => {
  const id = user._id

  const products = await productModel.find({userRef: id})
  if(!products.length)
    return;

  for(product of products) 
    await user.productTagsRef.push(product._id)
  
  await user.save()
}

const seedUserWithoutRefs= async() => {
  // let times = 1020
  // while(times--) {
    const user = await userModel.create({
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      money: faker.random.number(),
      email: faker.internet.email(),
      streetAddress: faker.address.country(),
    })
  // }

    // console.log(user)
} 

// (async() => {
//   await seedUserWithoutRefs()
// })()

module.exports = {seedUserWithoutRefs, fillProductByUser, userModel}
