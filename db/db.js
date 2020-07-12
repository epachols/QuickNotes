const util = require("util");
const jsonDb = require("/db.json");
const fs = require("fs");

 readfileAsync = util.promisify(fs.readFile);
 writeFileAsync = util.promisify(fs.writeFile);

 class DB{
   async readNotes(){
     try {
       const notesRaw = await readfileAsync(jsonDb, "utf8")
       console.log("notesRaw!", notesRaw);
       return notesRaw ? JSON.parse(notesRaw) : [];
     } catch (e){
       console.log("I have failed you;", e)
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

 const testDB = new DB();
 testDB.writeNotes({
   title: "yes",
   text: "another test",
   id: 1
 })

 console.log(testDB.readNotes());

//  module.exports = new DB();