// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
// using that neat nanoid module, importing the main method of the module.
const { nanoid } = require("nanoid");
const db = require("./db/db");
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
app.get("/api/notes", async function(req,res){
    const freshNotes = await db.readNotes();
    res.json(freshNotes);
});

// to post
app.post('/api/notes', async function(req,res) {
    // saying what comes in from the user is what I care about
    const newNote = req.body;
    //applying a unique stamp to it via randomization (chances of duplicating Id astronomically low)
    newNote.id= nanoid();
    // saying everything that follows depends on waiting the results of the readfile assigned below.
    const retrievedNotes = await db.readNotes();
    //using the async write function 
    const freshlyWrittenNotes = await db.writeNotes([...retrievedNotes, newNote]);
    res.json(newNote);
})
    
// TO DELETE
app.delete('/api/notes/:id', async function(req,res){
    let myId = req.params.id;
    console.log(myId);
    //need to read the db file and await its results
    const retrievedNotes = await db.readNotes();
    //then look inside those results for the id in question (filter)
    const deliciousdeletion = retrievedNotes.findIndex(note => note.id === myId);
    //remove that item
    retrievedNotes.splice(deliciousdeletion, 1);
    //rewrite the array back to jsonDB so it has the updated info
    await db.writeNotes(retrievedNotes);
    //in this rare exception this return is less important
    res.json(`STATUS: 200 we have deleted your note with the unique id of :${myId}`) 
});

//setting up to listen:
app.listen(PORT, function() {
    console.log("App listening on PORT http://localhost:" + PORT);
});


