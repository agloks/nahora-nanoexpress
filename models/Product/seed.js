require('dotenv').config()

const mongoose = require("mongoose")
const faker = require("faker")
const productModel = require("./product")
const userModel = require("../User/user")

// mongoose
//   .connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true })
//   .then(x => { console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)})
//   .catch(err => { console.error('Error connecting to mongo', err)});

const randInt = (min, max) => parseInt(Math.random() * (max - min) + min);

const fillUserRef = async(user, product) => {
  product.userRef = user._id

  console.log(product)
  await product.save();
}

const seddProductWithoutRef = async () => {
  // let times = 300
  // while(times--) {
    const result = await productModel.create({
      name: faker.name.findName(),
      timeToQuery: randInt(60, 2),
    // })
    })
    // console.log(result)
} 

module.exports = {seddProductWithoutRef, fillUserRef, productModel}