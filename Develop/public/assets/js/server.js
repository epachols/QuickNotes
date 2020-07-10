// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");
const { json } = require("express");
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

const jsonDb = fs.readFileSync(path.resolve(__dirname, "../../../db/db.json"));

// trying to use an empty array to push data into and out of , remember to empty it upon update or read 
let currentNotes = [];

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//make get handlers here

    //for home page
    app.get("/", function(req, res) {
        res.sendFile(path.join(__dirname, "../../index.html"));
        });

    //for notes
    app.get("/notes", function(req, res) {
        res.sendFile(path.join(__dirname, "../../notes.html"));
        });

//     //read get handler ***UNTESTED, WILL TEST SIMULTANEOUSLY WITH POST, NEXT**
//     app.get("/api/notes", function(req, res) {
//         let savednotes = "";
//         fs.readFile(jsonDb, 'utf8', (err, data) => {
//              if (err) throw err
//         // saving the data from the read (which is a json string) to a local var 
//         savednotes = data;
//         // spread syntax likely used incorrectly here 
//         currentNotes(...JSON.parse(savednotes));
//         //test console log
//         console.log(currentNotes);
//          })   
//         return res.json(data);
//     });

// // make post handler here
// app.post("/api/notes", function(req, res) {
//     // req.body hosts is equal to the JSON post sent from the user
//     // This works because of our body parsing middleware
//     var newNote = req.body;
//     currentNotes.push(newNote);
//     res.json(currentNotes);
//    })
// // read, add new thing to array or obj array, then put whole thing back into json to send off.



//setting up to listen:
app.listen(PORT, function() {
    console.log("App listening on PORT http://localhost:" + PORT);
  });