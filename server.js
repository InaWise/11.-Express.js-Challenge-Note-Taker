const express = require('express');
const fs = require('fs')
var app = express();
const PORT = process.env.PORT || 3001;
// var static_dir = ('backend', 'public');
var db_dir = ('backend', 'db');
var db = db_dir + '/db.json';
const path =require('path')

const { 
    v1: uuidv1,
    v4: uuidv4,
} = require('uuid');

app.use(express.static('public'));
// for parsing application/json
app.use(express.json()); 

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); 



app.get('/notes', function(req, res){
    console.log("get /notes ")
    // res.sendFile('notes.html', {root: static_dir});
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});
app.get('/api/notes', function(req, res) {
    fs.readFile(db, 'utf8', function (err,data) {
        if (err) {
        return console.log(err);
        }
        let notes = JSON.parse(data);
        res.send(notes);
    });

});
app.delete('/api/notes/:id', function(req, res){

    console.log("delete /api/notes " + req.params.id)

    let data = fs.readFileSync(db, 'utf8');
    let notes = JSON.parse(data);
    let newData = [];

    for (i in notes) {
        console.log(notes[i].id);
        if (notes[i].id != req.params.id) {
            newData.push(notes[i]);
        }
    }
    data = JSON.stringify(newData);
    fs.writeFileSync(db, data, 'utf8');
    res.sendFile('notes.html', {root: static_dir});
});
app.post('/api/notes', function(req, res){
    let data = fs.readFileSync(db, 'utf8');

    let notes = JSON.parse(data);
    notes.push({'id': uuidv1(), 'title': req.body.title, 'text': req.body.text});
    data = JSON.stringify(notes);
    fs.writeFileSync(db, data, 'utf8');

    res.sendFile('notes.html', {root: static_dir});
});
app.listen(port);
console.log('Starting server on port ' + port);