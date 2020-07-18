require('dotenv').config()

const mongoose = require("mongoose")
const moment = require("moment")
const productModel = require("./models/Product/product")
const userModel = require("./models/User/user")

mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
  .then(x => { console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)})
  .catch(err => { console.error('Error connecting to mongo', err)});

const queryPopulateUser = async() => {
  const user = await userModel.findOne({_id: "5f1373bc245837046f63025d"}).populate("productTagsRef")
  return await user.execPopulate();

  // const product = await productModel.findOne({_id: "5f1373bc245837046f630268"}).populate("userRef")
  // return await product.execPopulate()
}

const queryAllProducts = async() => {
  //utc in seconds scala
  const actualTime = moment.utc().unix()
  //1 minute in miliseconds
  const seconds = 60
  //begin time to look
  const beginTime = actualTime - seconds
  const query = {
    $and: [ { "timeToQuery": 2, "updatedAtUnixEpoch": { $lt: beginTime } } ]
  }

  const product = await productModel.find(query)

  console.log(product)
}

(async() => {
  // const result = await queryPopulateUser()
  await queryAllProducts()
  
  // console.log(result)
  console.log("ok...")
})()