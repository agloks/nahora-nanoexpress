const app  = require("../app")

app.post('/another', async (req, res) => {
  console.log(req.body)

  return { EI: 'OK' }
});
