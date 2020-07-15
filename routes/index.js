const app  = require("../app")

app.get('/', async () => ({ hello: 'world' }));

app.get('/send', (req, res) => {
  return res.send({ status: 'ok' });
});
