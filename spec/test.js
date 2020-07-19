require('dotenv').config()

var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

const mongoose = require("mongoose")
const moment = require("moment")
const productModel = require("../models/Product/product")
const userModel = require("../models/User/user")

mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
  .then(x => { console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)})
  .catch(err => { console.error('Error connecting to mongo', err)});

// const queryAllProducts = async() => {
//   //utc in seconds scala
//   const actualTime = moment.utc().unix()
//   //1 minute in miliseconds
//   const seconds = 60
//   //begin time to look
//   const beginTime = actualTime - seconds
//   const query = {
//     $and: [ { "timeToQuery": 2, "updatedAtUnixEpoch": { $lt: beginTime } } ]
//   }

//   const product = await productModel.find(query)

//   console.log(product)
// }

// (async() => {
//   // const result = await queryPopulateUser()
//   await queryAllProducts()
  
//   // console.log(result)
//   console.log("ok...")
// })()

class buildPopulate {
  static async get() {
    const result = await this.model.findOne(this.query).populate(this.ref)
    return await result.execPopulate()
  }
}

describe('CRUD', async () => {
  describe('#1', async () => {
    it('create User', async () => {
      const user = await userModel.create({
        name: "TESTECREATE",
        phone: "8080",
        money: 120.12,
        email: "TESTE@TESTE.TESTE",
        streetAddress: "Earth",
      })
      user
    })
  })
})

describe('Populate', async () => {
  describe('#1', async () => {
    it('populate user with productTagsRef', async () => {
      let user = await userModel.findOne({_id: "5f1373bc245837046f63025d"}).populate("productTagsRef")
      user = await user.execPopulate();

      user.productTagsRef[0].timeToQuery.should.not.equal(Number)
    });

    it('buildPopulate working fine with user', async () => {
      buildPopulate.model = userModel
      buildPopulate.query = {_id: "5f1373bc245837046f63025d"}
      buildPopulate.ref = "productTagsRef"
      const user = await buildPopulate.get()

      user.productTagsRef[0].timeToQuery.should.not.equal(Number)
    });
  });

  describe('#2', async () => {
    it('populate product with userRef', async () => {
      let product = await productModel.findOne({_id: "5f1373bc245837046f630268"}).populate("userRef")
      product = await product.execPopulate()

      product.userRef.phone.should.be.a("string")
    });

    it('buildPopulate working fine with product', async () => {
      buildPopulate.model = productModel
      buildPopulate.query = {_id: "5f1373bc245837046f630268"}
      buildPopulate.ref = "userRef"
      const product = await buildPopulate.get()

      product.userRef.phone.should.be.a("string")
    });
  });
});