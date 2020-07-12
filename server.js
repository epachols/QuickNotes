// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
// using that neat nanoid module, importing the main method of the module.
const { nanoid } = require("nanoid");
//redoing Read and Write to Async.
const readfileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
//path to the database json file
const jsonDb = (path.resolve(__dirname, "db/db.json"));
// TODO:the below line will be useful when modularizing, for now it is redundant. however dbFunction is written.
// const dbFunction = require("./db/db.js");

// Sets up the Express App
// =============================================================
var app = express();
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

//retrieving the note data from db.json
app.get("/api/notes", function(req,res){
    readfileAsync(jsonDb,"utf8").then(function(data){
        return res.json(JSON.parse(data)) 
    })
});

// to post
app.post('/api/notes', async function(req,res) {
    // saying what comes in from the user is what I care about
    const newNote = req.body;
    //applying a unique stamp to it via randomization (chances of duplicating Id astronomically low)
    newNote.id= nanoid();
    // saying everything that follows depends on waiting the results of the readfile assigned below.
    const retrievedNotes = await readNotes();
    //using the async write function 
    const freshlyWrittenNotes = await writeNotes([...retrievedNotes, newNote]);
    res.json(newNote);
})
    
// TO DELETE
app.delete('/api/notes/:id', async function(req,res){
    let myId = req.params.id;
    console.log(myId);
    //need to read the db file and await its results
    const retrievedNotes = await readNotes();
    //then look inside those results for the id in question (filter)
    const deliciousdeletion = retrievedNotes.findIndex(note => note.id === myId);
    //remove that item
    retrievedNotes.splice(deliciousdeletion, 1);
    //rewrite the array back to jsonDB so it has the updated info
    writeNotes(retrievedNotes);
    //in this rare exception this return is less important
    res.json(`STATUS: 200 we have deleted your note with the unique id of :${myId}`) 
});

//setting up to listen:
app.listen(PORT, function() {
    console.log("App listening on PORT http://localhost:" + PORT);
});

async function readNotes(){
    try {
    const notesRaw = await readfileAsync(jsonDb, "utf8")
//    console.log("notesRaw!", notesRaw);
    return notesRaw ? JSON.parse(notesRaw) : [];
    } catch (e){
    console.log("I have failed you;", e)
    }
}

async function writeNotes(noteArr){
    try{
    await writeFileAsync(jsonDb, JSON.stringify(noteArr), "utf8")
    } catch(e) {
    console.log("I have failed you;", e)
    }
}


// next up:
// TODO: separation of concerns - 
// TODO: read/write functions into object class for export and Reference , converting local references to call db.writefile etc as we go
// TODO:put that in a controllers folder along with the routes.js I will pull the page routing and pulling into.
// TODO: clean up the excess code in server.js, all the references i won't need anymore, by their lack of use coloration after commenting out the redundancies and maintaining function.
// TODO:
