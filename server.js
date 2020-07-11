// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");
var util = require("util");
const { json } = require("express");
readfileAsync = util.promisify(fs.readFile);
writefileAsync = util.promisify(fs.writeFile);

// trying to use an empty array to push data into and out of , remember to empty it upon update or read 
// const currentNotes = [];
const currentNotes = [{"title":"iF YOU","text":"ARE GRABBING THIS, YOU'RE HALFWAY THERE"}];
const jsonDb = (path.resolve(__dirname, "db/db.json"));

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
// ==========================REUSABLE CODE SNIP ABOVE=============


//make get handlers here

    //for home page
    app.get("/", function(req, res) {
        res.sendFile(path.join(__dirname, "/public/index.html"));
        });

    //for notes
    app.get("/notes", function(req, res) {
        res.sendFile(path.join(__dirname, "/public/notes.html"));
        });


    
    //fix the return of this so that it readsfile:
    app.get('/api/notes', async function(req,res) {
        try {
        const notesRaw = await readfileAsync(jsonDb, "utf8")
        console.log("line of server.js: 47", notesRaw);
        console.log("line of server.js: 48", JSON.parse(notesRaw));
        notesRaw ? currentNotes.push(...JSON.parse(notesRaw)) : []; 
        } catch (e) {
        console.log("wrong!", e)
        }
        res.json(currentNotes);
    })
 
    app.post('/api/notes', async function(req,res) {
        const newNote = (req.body);
        currentNotes.push(newNote);
        console.log(currentNotes);
        res.json(newNote)
    })
    
    


    // class DB{
    //     async readNotes(){
    //       try {
    //         const notesRaw = await readfileAsync(jsonDb, "utf8")
    //         console.log("notesRaw!", notesRaw);
    //         return notesRaw ? JSON.parse(notesRaw) : [];
    //       } catch (e){
    //         console.log("wrong!", e)
    //       }
    //     }
    //     async writeNotes(notesArr){
    //       try{
    //        await writeFileAsync(jsonDB, JSON.stringify(notesArr), "utf8")
    //       } catch(e) {
    //          console.log("wrong!", e)
    //       }
    //     }
    //   }




//setting up to listen:
app.listen(PORT, function() {
    console.log("App listening on PORT http://localhost:" + PORT);
  });