require('dotenv').config()

const nanoexpress = require("nanoexpress-pro")
const mongoose = require("mongoose")

mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
  .then(x => { console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)})
  .catch(err => { console.error('Error connecting to mongo', err)});

const app = nanoexpress();
module.exports = app

// ROUTES
require("./routes/index")

app.listen(4000, '0.0.0.0');