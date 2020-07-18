require('dotenv').config()

const mongoose = require("mongoose")
const faker = require("faker")
const userModel = require("./user")

mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true })
  .then(x => { console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)})
  .catch(err => { console.error('Error connecting to mongo', err)});

const randomProductTags = () => {
  const times = parseInt(Math.random() * (8 - 2) + 2)
  let items = []

  for(let x = 0; x < times; x++)
    items.push({ name: faker.hacker.noun() })

  return items
}

(async () => {
  let times = 1020
  while(times--) {
    const result = await userModel.create({
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      money: faker.random.number(),
      email: faker.internet.email(),
      streetAddress: faker.address.country(),
      productTags: randomProductTags()
    })

    console.log(result)
  }  
})()
