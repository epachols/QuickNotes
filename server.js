// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");
var util = require("util");
// using that neat nanoid module, I think
const { nanoid } = require("nanoid");

readfileAsync = util.promisify(fs.readFile);
writeFileAsync = util.promisify(fs.writeFile);

// empty array to push data into and out of
// let notesArr = [];
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

//getnotes
app.get("/api/notes", function(req,res){
    readfileAsync(jsonDb,"utf8").then(function(data){
        return res.json(JSON.parse(data)) 
    })
});

// to post **WIP**
app.post('/api/notes', async function(req,res) {
    // saying what comes in from the user is what I care about
    const newNote = req.body;
    //applying a unique stamp to it via randomization (chances of duplicating Id astronomically low)
    newNote.id= nanoid();
    // saying everything that follows depends on waiting the results of the readfile assigned below.
    const retrievedNotes = await readNotes();
    //double checking below
    console.log(retrievedNotes);
    //using the async write function (as last step, who cares unless someone tries to do it again before this is done?)
    const freshwritten = await writeNotes([...retrievedNotes, newNote]);
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