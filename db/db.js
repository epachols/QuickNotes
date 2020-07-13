const util = require("util");
const fs = require("fs");
const path = require("path");
const jsonDb = (path.resolve(__dirname, "./db.json"));
const readfileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

 class dbFunction{
    async readNotes(){
        try {
        const notesRaw = await readfileAsync(jsonDb, "utf8")
        return notesRaw ? JSON.parse(notesRaw) : [];
        } catch (e){
        console.log("Oo, I forgot my glasses. Can't read that;", e)
        }
    }

    async writeNotes(noteArr){
        try{
        await writeFileAsync(jsonDb, JSON.stringify(noteArr), "utf8")
        } catch(e) {
        console.log("I have failed you;", e)
        }
    }
 }

//this is an example of a singleton pattern
 module.exports = new dbFunction();