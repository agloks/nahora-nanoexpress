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

class TheManSeeEverything {
  constructor(timeToQuery = 120, defaultTimeBegin = 80) {
    this.defaultTimeBegin = defaultTimeBegin; //utc in seconds scala
    this.timeToQuery = timeToQuery;
    this.actualTime = moment.utc().unix(); 
    this.userResultFiltered = [];
  }

  updateActualTime() {
    this.actualTime = moment.utc().unix(); 
  }

  async updateTagUsers() {
    let result = []

    for(let objUser of this.userResultFiltered) {
      for(let tag of objUser.productTags) {
        tag.updatedAtUnixEpoch = this.actualTime

        result.push({
          action: "updated",
          tagsUpdated: tag
        })
      }
      await objUser.user.save()
    }

    return result
  };

  filterUsersResult(allUsers, allQuery) {
    allUsers.forEach((user) => {
      let objFiltered = {
        _id: user._id,
        productTags: [],
        user: user
      }
  
      for(let query in allQuery) {
        for(let document of user.productTags) {
          if(document[query] === allQuery[query]) {
            objFiltered.productTags.push(document)
          }
        }
      }
  
      this.userResultFiltered.push(objFiltered)
    })
  }

  async workEventTwoMinute() {
      //1 minute in miliseconds
      const seconds = minuteToSeconds(this.defaultTimeBegin)
      //begin time to look
      const beginTime = this.actualTime - seconds
      const query = {
        $and: [ { "productTags.timeToQuery": this.timeToQuery, "productTags.updatedAtUnixEpoch": { $lt: beginTime } } ]
      }
      
      const usersResult = await userModel.find(query).limit(50)

      console.log(beginTime)
      console.log(usersResult[0].productTags[4].updatedAtUnixEpoch)
      customDebugTime(usersResult[0].productTags[4].updatedAtUnixEpoch)

      this.filterUsersResult(usersResult, {"timeToQuery": 120})
      return usersResult
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
}

// //TODO: kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
// async function updateTagUsers(users) {
//   let result = []

//   for(let tags of users) {
//     for(let tag of tags.productTags) {
//       const user = await userModel.findOne({"productTags._id": tag._id})
//           for(let userTag of user.productTags) {
//             if(userTag.updatedAtUnixEpoch >= 1595082299) {
//               userTag.updatedAtUnixEpoch = moment.utc().unix()
//               await user.save()

//               result.push({
//                 action: "updated",
//                 tagsUpdated: userTag
//               })
//             }
//           }
//         }
//       }

//   return result
// };

// const filterUsersResult = (allUsers, allQuery) => {
//   const resultFiltered = []

//   allUsers.forEach((user) => {
//     let objFiltered = {
//       _id: user._id,
//       productTags: [] 
//     }

//     for(let query in allQuery) {
//       for(let document of user.productTags) {
//         if(document[query] === allQuery[query]) {
//           objFiltered.productTags.push(document)
//         }
//       }
//     }

//     resultFiltered.push(objFiltered)
//   })

//   return resultFiltered
// }

// async function workEventTwoMinute() {
//     //utc in seconds scala
//     const actualTime = moment.utc().unix()
//     //1 minute in miliseconds
//     const seconds = minuteToSeconds(80)
//     //begin time to look
//     const beginTime = actualTime - seconds
//     const query = {
//       $and: [ { "productTags.timeToQuery": 120, "productTags.updatedAtUnixEpoch": { $gte: beginTime } } ]
//     }

//     const usersResult = await userModel.find(query) .limit(50)

//     filterUsersResult(usersResult, {"timeToQuery": 120})

//     return usersResult
// };

// async function* takeFromDB() {
//   console.log("[takeFromDB] stated")
  
//   const usersResult = await workEventTwoMinute()
//   // const usersResult = await userModel.find({"productTags.updatedAtUnixEpoch": 1595082299}).limit(6)

//   /*the generator part, when generator return the yield, the last next will execute only is into of while,
//     so is safe above doesn't will execute again*/
//   let internCount = 0
//   //size of usersResult until max of 50
//   let maxCount = usersResult.length
//   while(internCount < maxCount) {
//     console.log(`[takeFromDB] internCount = ${internCount += 1}`)

//     // await _sleep(1000)
//     // console.log(usersResult)
//     // console.log(beginTime)

//     yield usersResult.splice(0, 2)
//   }

//   //case empty peopleForDoRequest as []
//   return false
// };

async function makeRequest(peopleForDoRequest) {
  const promises = [...(peopleForDoRequest.value)].map(() => {
    return getPesquisa().catch(e => e) // Handling the error for each promise.
  })

  const result = await Promise.all(promises)
    .then(response => response)
    .catch(error => `Error in executing ${error}`)

  console.log(printPromises(result))
}

// async function* mainLoop() {
//   //will be at max 50, returning with yield with 10, the function takeFromDB, will limit it...
//   const genTakeFromDB = takeFromDB()
//   let peopleForDoRequest = await genTakeFromDB.next()
  
//   while(peopleForDoRequest.value.length) {
    
//     // await makeRequest(peopleForDoRequest)

//     // console.log(await updateTagUsers(peopleForDoRequest.value))
//     peopleForDoRequest = await genTakeFromDB.next()

//     // yield result
//     yield true
//   }

//   //case empty peopleForDoRequest as []
//   return false
// };

async function* mainLoop() {
  //will be at max 50, returning with yield with 10, the function takeFromDB, will limit it...
  const god = new TheManSeeEverything(120, 2)
  const genTakeFromDB = await god.takeFromDB()
  let peopleForDoRequest = await genTakeFromDB.next()
  
  while(peopleForDoRequest.value.length) {
    
    // await makeRequest(peopleForDoRequest)
    const result = await god.updateTagUsers()
    god.updateActualTime()
    console.log(result)
    
    peopleForDoRequest = await genTakeFromDB.next()

    yield true
  }

  //case empty peopleForDoRequest as []
  return false
};
// ---------------------------------------------------- MAIN ------------------------------------------------------------------------------ //

(async () => {
  while(true) {
    const gen = mainLoop()
    await blockCode(() => async() => await gen.next(), 5000, "no-limit", console.log, "Calling blockCode...")
    // await _sleep(30000)
  }
})()