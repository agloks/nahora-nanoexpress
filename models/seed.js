require('dotenv').config()

const mongoose = require("mongoose")
const faker = require("faker")
const {seddProductWithoutRef, fillUserRef, productModel} = require("./Product/seed")
const {seedUserWithoutRefs, fillProductByUser, userModel} = require("./User/seed")

mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true })
  .then(x => { console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)})
  .catch(err => { console.error('Error connecting to mongo', err)});

const randInt = (min, max) => parseInt(Math.random() * (max - min) + min);

(async() => {
  let times = 10
  let repetition = 50
  while(times --> 2) {
    while(repetition --> 0) {
      await seedUserWithoutRefs();
      await seddProductWithoutRef();
    }
    const usersResult = await userModel.find();
    const randomChoiceUser = randInt(usersResult.length - 1, 1)
    const productsResult = await productModel.find()
    const randomChoiceProduct = randInt(productsResult.length - 1, 1)
    
    const user = usersResult[randomChoiceUser];
    const product = productsResult[randomChoiceProduct];

    await fillUserRef(user, product);
    await fillProductByUser(user);
    console.log(user)

    repetition = 50
  }
})()