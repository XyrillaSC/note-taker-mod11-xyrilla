const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

// Alterative Write file
const writeToFile = (destination, content) =>
    fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
        err ? console.error(err) : console.info(`\nData written to ${destination}`)
    );


// GET Route for homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET for notes db
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST for notes db
app.post('/api/notes', (req, res) => {

    writeToFile('./db/db.json', req.body)

    console.info(`${req.method} request received to add a note`);
});





app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);