const faker = require("faker")
const productModel = require("./product")


const randInt = (min, max) => parseInt(Math.random() * (max - min) + min);

const fillUserRef = async(user, product) => {
  product.userRef = user._id

  console.log(product)
  await product.save();
}

const seddProductWithoutRef = async () => {
  const result = await productModel.create({
    name: faker.name.findName(),
    timeToQuery: randInt(60, 2),
  })
} 

module.exports = {seddProductWithoutRef, fillUserRef, productModel}