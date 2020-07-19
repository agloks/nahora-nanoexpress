require('dotenv').config()

const faker = require("faker")
const userModel = require("./user")
const productModel = require("../Product/product")

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
  const user = await userModel.create({
    name: faker.name.findName(),
    phone: faker.phone.phoneNumber(),
    money: faker.random.number(),
    email: faker.internet.email(),
    streetAddress: faker.address.country(),
  })
} 

module.exports = {seedUserWithoutRefs, fillProductByUser, userModel}