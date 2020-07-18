const mongoose = require("mongoose")
const moment = require("moment")
const Schema = mongoose.Schema

const getUnixEpoch = () => moment.utc().unix()

const productSchema = new Schema({
  name: String,
  timeToQuery: {type: Number, default: 30},
  userRef: {type: Schema.Types.ObjectId, ref: "users"}, 
  updatedAtUnixEpoch: {type: Number, default: getUnixEpoch},
  cratedAtUnixEpoch: {type: Number, default: getUnixEpoch} //utc in seconds scala
},
{timestamps: true})

const productModel = mongoose.model("products", productSchema)

module.exports = productModel