const express = require('express');
const path = require('path');
const fs = require('fs');
const notesData = require('./db/db.json');
const notesPath = '.db/db.json';
const uuid = require('uuid');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// HTML ROUTING:
// Get request for landing page (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });

// GET request for notes page (notes.html)
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
  });


// API ROUTING:
// GET request for notes (db.json)
app.get('/api/notes', (req, res) => {
    res.status(200).json(notesData);
  });

// POST request to add a note
app.post('api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note.`);
    const { title, text } = req.body
    if (title && text) {
        // Variable for the object we will save (newNote)
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        let data = fs.readFileSync(notesPath, 'utf8');

        const dataJSON = JSON.parse(data);

        dataJSON.push(newNote);

        fs.writeFile(notesPath,
            JSON.stringify(dataJSON),
            (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
        console.log('Added a new note.');
        res.status(201).json(data);

    } else {
        console.log('error');
        res.status(500).json('Error in saving note');
    };
})

app.delete('api/notes/:id', (req, res) => {
    let data = fs.readFileSync(notesPath, 'utf8');

    const dataJSON = JSON.parse(data);
    const addedNotes = data.JSON.filter((note) => {
        return note.id;
    });

    fs.writeFile(notesPath, 
        JSON.stringify(addedNotes), 
        (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
    
    res.json(addedNotes);
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
