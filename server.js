const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const testRouter = require('./app/routes/testRoutes')
const mongoose = require("mongoose")
const path = require('path')

// var corsOptions = {
//   origin: "http://localhost:8080"
// };

const app = express();
var corsOptions = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
}

// app.use(cors(corsOptions));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: "50mb" }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const { options } = require("./app/routes/testRoutes");

db.mongoose
  .connect(
    `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`
    // dbConfig.prod_db
    , {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    // initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to the NEMA Riparian application." });
// });

// routes
// app.use('/testRoute', testRouter)
require("./app/routes/auth.routes")(app);
require("./app/routes/campaign.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/withdrawal_request.routes")(app);
// require("./app/routes/project.routes")(app);
// require("./app/routes/riparian.routes")(app);
// require("./app/routes/type.routes")(app);
require("./app/routes/logins.routes")(app);
// require("./app/routes/task.routes")(app);
// require("./app/routes/region.routes")(app);
// require("./app/routes/supervisor.routes")(app);

// serve the index.html in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('./client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// set port, listen for requests
const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

