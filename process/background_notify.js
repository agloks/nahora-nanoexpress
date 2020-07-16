require('dotenv').config()

const mongoose = require("mongoose")
const moment = require("moment")
const userModel = require("../models/User/user")

mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
  .then(x => { console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)})
  .catch(err => { console.error('Error connecting to mongo', err)});

const minuteToSeconds = (minute) => (minute * 60)

const customDebugTime = (unixEpoch) => {
  const utcDateFromParam = moment.unix(unixEpoch).utc()
  const localDateFromParam = moment.unix(unixEpoch).local()
  const differencesMinute = Math.abs(moment.utc().subtract(utcDateFromParam).minutes())
  console.log(`
    -- utc date from paramater = ${utcDateFromParam}
    -- local date from parameter = ${localDateFromParam}
    -- differences of minute between now and paramater = ${differencesMinute}
  `)
}

async function* takeFromDB() {
  //utc in seconds scala
  const actualTime = moment.utc().unix()
  //1 minute in miliseconds
  const seconds = minuteToSeconds(2)
  //begin time to look
  const beginTime = actualTime - seconds

  const usersResult = await userModel.find({cratedUnixEpoch: {$gte: beginTime}})

  for(collection of usersResult) {
    customDebugTime(collection.cratedUnixEpoch)
  }
  
  console.log(usersResult)
  console.log(beginTime)
}

takeFromDB().next()