const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {type : Schema.Types.Mixed},
  money: {type : Schema.Types.Mixed},
  phone: {type : Schema.Types.Mixed},
  email: {type : Schema.Types.Mixed},
  location: {type : Schema.Types.Mixed},
  productsTag: [
    {
      name: String,
      dateRegistredUnixepoch: {type: Number, default: parseInt(new Date()/1000)},
      dateISO: {type: Number, default: new Date()}
    }
  ]
},
{timestamps: true})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel