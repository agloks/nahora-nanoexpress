const nanoexpress = require("nanoexpress-pro")

const app = nanoexpress();
module.exports = app

// ROUTES
require("./routes/index")
require("./routes/another_route")

app.listen(4000, '0.0.0.0');