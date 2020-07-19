require('dotenv').config();

const mongoose = require("mongoose");
const moment = require("moment");

const userModel = require("../models/User/user");
const productModel = require("../models/Product/product");
const { blockCode } = require("../libs/blockCode");
const { getPesquisa } = require("../requests/test");

mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
  .then(x => { console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)})
  .catch(err => { console.error('Error connecting to mongo', err)});

const minuteToSeconds = (minute) => (minute * 60);
const customDebugTime = (unixEpoch) => {
  const utcDateFromParam = moment.unix(unixEpoch).utc()
  const localDateFromParam = moment.unix(unixEpoch).local()
  const differencesMinute = Math.abs(moment.utc().subtract(utcDateFromParam).minutes())
  console.log(`
    -- utc date from paramater = ${utcDateFromParam}
    -- local date from parameter = ${localDateFromParam}
    -- differences of minute between now and paramater = ${differencesMinute}
  `)
};
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
};

class TheManSeeEverything {
  constructor(timeToQuery = 120, defaultTimeBegin = 80) {
    //defaultTimeBegin useful only in development
    this.defaultTimeBegin = defaultTimeBegin; //utc in seconds scala
    this.timeToQuery = timeToQuery;
    this.actualTime = moment.utc().unix();
  }

  updateActualTime() {
    this.actualTime = moment.utc().unix(); 
  }

  async updateTagUsers(productsTags) {
    const result = []

    for(let tag of productsTags) {
      tag.updatedAtUnixEpoch = this.actualTime
      result.push({
        action: "updated",
        tagsUpdated: tag
      })
      await tag.save()
    }

    return result
  };

  async workEventTwoMinute() {
      //minute in miliseconds
      const seconds = minuteToSeconds(this.defaultTimeBegin)
      //begin time to look
      const beginTime = this.actualTime - seconds
      const query = {
        $and: [ { "timeToQuery": this.timeToQuery, "updatedAtUnixEpoch": { $lt: beginTime } } ]
      }
      
      return await productModel.find(query).limit(50)
  };

  async* takeFromDB() {
    console.log("[takeFromDB] stated")
    
    const usersResult = await this.workEventTwoMinute()
    /*the generator part, when generator return the yield, the last next will execute only is into of while,
      so is safe above doesn't will execute again*/
    let internCount = 0
    //size of usersResult until max of 50
    let maxCount = usersResult.length
    while(internCount < maxCount) {
      console.log(`[takeFromDB] internCount = ${internCount += 1}`)
      yield usersResult.splice(0, 2)
    }
  
    //case empty peopleForDoRequest as []
    return false
  };  
};

async function makeRequest(peopleForDoRequest) {
  const promises = [...(peopleForDoRequest.value)].map(() => {
    return getPesquisa().catch(e => e) // Handling the error for each promise.
  })

  const result = await Promise.all(promises)
    .then(response => response)
    .catch(error => `Error in executing ${error}`)

  console.log(printPromises(result))
};

async function* mainLoop() {
  //will be at max 50, returning with yield with 10, the function takeFromDB, will limit it...
  const god = new TheManSeeEverything(4, 4)
  const genTakeFromDB = god.takeFromDB()
  let productsForDoRequest = await genTakeFromDB.next()
  
  while(productsForDoRequest.value.length) {
    
    // await makeRequest(productsForDoRequest)
    const result = await god.updateTagUsers(productsForDoRequest.value)
    god.updateActualTime()
    console.log(result)
    productsForDoRequest = await genTakeFromDB.next()
    
    yield true
  }

  //case empty productsForDoRequest as []
  return false
};
// ---------------------------------------------------- MAIN ------------------------------------------------------------------------------ //

(async () => {
  while(true) {
    const gen = mainLoop()
    await blockCode(() => async() => await gen.next(), 2500, "no-limit", console.log, "Calling blockCode...")
    await _sleep(15000)
  }
})()