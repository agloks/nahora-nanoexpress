const util = require("util")
const app  = require("../app")

//TIP: whatever wanna to use into app need to inject as middleware. 
app.use((req, res, next) => {
  res.util = util
  next()
})

app.post('/another', async (req, res) => {
  const { util } = res
  console.log( util.inspect(req) )

  return { EI: 'OK' }
});
