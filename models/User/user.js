const mongoose = require("mongoose")
const moment = require("moment")
const Schema = mongoose.Schema

const getUnixEpoch = () => moment.utc().unix()

const userSchema = new Schema({
  username: {type : Schema.Types.Mixed},
  money: {type : Schema.Types.Mixed},
  phone: {type : Schema.Types.Mixed},
  email: {type : Schema.Types.Mixed},
  streetAddress: {type : Schema.Types.Mixed},
  latitude: Number,
  longitude: Number,
  productTags: [
    { type: new Schema(
      {
      name: String,
      timeToQuery: {type: Number, default: 30},
      createdAtUnixEpoch: {type: Number, default: getUnixEpoch}, //utc in seconds scala
      updatedAtUnixEpoch: {type: Number, default: getUnixEpoch}
      },
      {timestamps: true}
    ) }
  ],
  updatedAtUnixEpoch: {type: Number, default: getUnixEpoch},
  cratedAtUnixEpoch: {type: Number, default: getUnixEpoch} //utc in seconds scala
},
{timestamps: true})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel