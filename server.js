// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const router = require("./router");
// Sets up the Express App
// =============================================================
var app = express();
// var router = express.Router();
var PORT = process.env.PORT || 3000;
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
// ==========================REUSABLE CODE SNIP ABOVE============

//for home page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
    });

//for notes
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
    });

//using the router
app.use("/api", router);

//setting up to listen:
app.listen(PORT, function() {
    console.log("App listening on PORT http://localhost:" + PORT);
});
