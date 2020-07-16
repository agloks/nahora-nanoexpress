const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {type : Schema.Types.Mixed},
  money: {type : Schema.Types.Mixed},
  phone: {type : Schema.Types.Mixed},
  email: {type : Schema.Types.Mixed},
  streetAddress: {type : Schema.Types.Mixed},
  latitude: Number,
  longitude: Number,
  productTags: [
    {
      name: String,
      dateUnixEpoch: {type: Number, default: parseInt(new Date()/1000)},
      dateISO: {type: Date, default: new Date()}
    }
  ],
  cratedUnixEpoch: {type: Number, default: parseInt(new Date()/1000)}
},
{timestamps: true})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel