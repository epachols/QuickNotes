// Dependencies
// =============================================================
var express = require("express");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//make get handlers here
//make post handlers here






//setting up to listen:
app.listen(PORT, function() {
    console.log("App listening on PORT http://localhost:" + PORT);
  });