// Dependencies
// =============================================================
const express = require("express");
// using that neat nanoid module, importing the main method of the module.
const { nanoid } = require("nanoid");
const db = require("./db/db");
// Sets up the Express App
// =============================================================
var router = express.Router();
// Sets up the Express app to handle data parsing
// ==========================REUSABLE CODE SNIP ABOVE============


//retrieving the note data from db.json
router.get("/notes", async function(req,res){
    const freshNotes = await db.readNotes();
    res.json(freshNotes);
});

// to post
router.post('/notes', async function(req,res) {
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
router.delete('/notes/:id', async function(req,res){
    let myId = req.params.id;
    //need to read the db file and await its results
    const retrievedNotes = await db.readNotes();
    //then look inside those results for the id in question (filter)
    const indexOfItemToDelete = retrievedNotes.findIndex(note => note.id === myId);
    //remove that item
    retrievedNotes.splice(indexOfItemToDelete, 1);
    //rewrite the array back to jsonDB so it has the updated info
    await db.writeNotes(retrievedNotes);
    //in this rare exception this return is less important
    res.json(`STATUS: 200 we have deleted your note with the unique id of :${myId}`) 
});

module.exports = router;