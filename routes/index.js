/*
 -- Case doesn't necessary in update route return response of query or make great modifies is good to use lean. ref: https://mongoosejs.com/docs/tutorials/lean.html
 -- Do strict schema to doesn't have possibilty to inject property different of our schema
 -- When is the moment put production, remove user object at response case doesn't need.
*/

const util = require("util")
const userModel = require("../models/User/user")
const app  = require("../app")

const ERROR_INTERN = async (req, res) => {
  res.status(500)
  return res.send({status: "ERROR_INTERN"})
}

//storage to user when does the first query.
class UserContext {
  static user = null
  static someProperties = [
    "phone", "username", "money",
    "email", "streetAddress", "productTags",
    "latitude", "longitude"
  ]
}

//TIP: whatever wanna to use into app need to inject as middleware. 
app.use((req, res, next) => {
  req.util = util
  req.userContext = UserContext
  res.error = ERROR_INTERN
  
  if(req.headers["content-type"] == "application/json")
    req.json = JSON.parse(req.body)

  next()
})

//it's important to use async here else will break
app.get('/', async () => ({ hello: 'world' }));

app.post('/listener', async (req, res) => {
  /*
    1- If user doesn't have register in our db, send to route of create new users
    2- If user have register in our db, send to route of register the new products/events
  */
  try {
    const {phone, productTags} = req.json

    if(!productTags) {
      res.status(422)
      return res.send({status: "Invalid Request, missing productTags"}) 
    }

    const user = await userModel.findOne({phone: phone})
    req.userContext.user = user;

    if(!user)
      return res.redirect(307, '/intern/create')
    else
      return res.redirect(307, '/intern/tagger')
    
    // const response = user
    
    // res.status(200)
    // return res.send(response)  
  } catch (error) {
    console.log(error)
    return res.error(req, res)
  }
});

app.post('/intern/create', async (req, res) => {
  try {
    // const {
    //   phone, username, money,
    //   email, streetAddress, productTags,
    //   latitude, longitude
    // } = req.json

    let userToCreate = {}
    for(item in req.json){
      if(req.userContext.someProperties.includes(item)) 
        userToCreate[item] = req.json[item]
    }
    const user = await new userModel(userToCreate)
    await user.save(true)
    
    const response = {
      userId: user._id,
      action: "created",
      user: user
    }
    
    res.status(201)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.error(req, res)
  } 
})

//the main role here is to add new tags, but could be useful doesn't limit only for it on moment...
app.post('/intern/update', async (req, res) => {
  try {
    const user = req.userContext.user
    const {
      phone, username, money,
      email, streetAddress, productTags,
      latitude, longitude
    } = req.json
    
    let userToUpdate = {}
    for(item in req.json){
      if(req.userContext.someProperties.includes(item))
        if(item === "productTags")
          // userToUpdate[item] = { $push: {[item] : req.json[item]} }
          null
        else 
          userToUpdate[item] = req.json[item]
    }

    const newUser = await userModel.findOneAndUpdate(
      {_id: user._id, phone: phone, createdAt: user.createdAt},
      userToUpdate,
      {omitUndefined: true}).lean()
    const response = {
      userId: newUser._id,
      action: "updated",
      user: newUser
    }

    res.status(200)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.error(req, res)
  } 
})


//the main role here is to add new tags, but could be useful doesn't limit only for it on moment...
app.post('/intern/tagger', async (req, res) => {
  try {
    const user = req.userContext.user
    const {
      phone, productTags
    } = req.json
    
    await user.productTags.push(productTags)
    await user.save(true)

    const response = {
      userId: user._id,
      action: "tagged",
      user: user
    }

    res.status(200)
    return res.send(response)
  } catch (error) {
    console.log(error)
    return res.error(req, res)
  } 
})