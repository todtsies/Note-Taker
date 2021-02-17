// Require dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

// Initialize Express package
const app = express();
const PORT = process.env.PORT || 8081;
const mainDir = path.join(__dirname, "/public");

// Set up data parsing
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// ROUTES TO HTML AND API DATA
app.get("/notes", function(req, res) {
    res.sendFile(path.join(mainDir, "notes.html"));
});

app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(savedNotes[Number(req.params.id)]);
});

app.get("*", function(req, res) {
    res.sendFile(path.join(mainDir, "index.html"));
});

app.post("/api/notes", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let newNote = req.body;
    let uniqueID = (savedNotes.length).toString();
    newNote.id = uniqueID;
    savedNotes.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    console.log("Note saved to db.json. Content: ", newNote);
    res.json(savedNotes);
})

// Delete note function
app.delete("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`Deleting note with ID ${noteID}`);
    savedNotes = savedNotes.filter(currNote => {
        return currNote.id != noteID;
    })
    
    for (currNote of savedNotes) {
        currNote.id = newID.toString();
        newID++;
    }

    // Write new notes to db.json file
    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
})

// LISTENER
// The below code effectively "starts" our server
app.listen(PORT, function () {
    console.log(`Server listening on: http://localhost:${PORT}`);
});

