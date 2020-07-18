require('dotenv').config();

const mongoose = require("mongoose");
const moment = require("moment");

const userModel = require("../models/User/user");
const { blockCode } = require("../libs/blockCode");
const { getPesquisa } = require("../requests/test");

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
const _sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
const printPromises = (promises) => {
  const status = {
    success: 0,
    errors: {
      count: 0,
      codes: []
    }
  }

  for(item of promises) {
    if(item.status >= 200 && item.status < 300 )
      status.success += 1
    else {
      status.errors.count += 1
      status.errors.codes.push(item.code)
    }
  }

  return status
}

async function* takeFromDB() {
  console.log("started?")
  //utc in seconds scala
  const actualTime = moment.utc().unix()
  //1 minute in miliseconds
  const seconds = minuteToSeconds(2)
  //begin time to look
  const beginTime = actualTime - seconds

  // const usersResult = await userModel.find({cratedUnixEpoch: {$gte: beginTime}}).limit(50)
  const usersResult = await userModel.find().limit(6)

  // for(collection of usersResult) {
  //   customDebugTime(collection.cratedUnixEpoch)
  // }

  /*the generator part, when generator return the yield, the last next will execute only is into of while,
    so is safe above doesn't will execute again*/
  let internCount = 0
  //size of usersResult until max of 50
  let maxCount = usersResult.length
  while(internCount < maxCount) {
    console.log(`[takeFromDB] internCount = ${internCount += 1}`)
    // await _sleep(6000)

    // console.log(usersResult)
    // console.log(beginTime)

    yield usersResult.splice(0, 2)
  }
}

/*
TODO: 

The send request with orders in user's productTags, and update the user when request is done.
Let's go use some api cool to test, and apply template pattern or command pattern.
*/
async function* doAll() {
  //will be at max 50, returning with yield with 10, the function takeFromDB, will limit it...
  const genTakeFromDB = takeFromDB()
  let peopleForDoRequest = await genTakeFromDB.next()
  
  while(peopleForDoRequest.value.length) {
    const promises = [...(peopleForDoRequest.value)].map(() => {
      return getPesquisa().catch(e => e) // Handling the error for each promise.
    })
    
    const result = await Promise.all(promises)
      .then(response => response)
      .catch(error => `Error in executing ${error}`)

    console.log(printPromises(result))
    peopleForDoRequest = await genTakeFromDB.next()

    yield result
  }

  //case empty peopleForDoRequest as []
  return false
}

// ---------------------------------------------------- MAIN ------------------------------------------------------------------------------ //

(async () => {
  while(true) {
    const gen =  doAll()
    await blockCode(() => async() => await gen.next(), 1000, "no-limit", console.log, "Calling blockCode...") 
  }
})()
