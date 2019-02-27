const sqlite3 = require('sqlite3').verbose();
//Database for user information
const db = new sqlite3.Database( __dirname + '/users.db',
function(err) {
    if ( !err ) {
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT,
            password TEXT,
            email TEXT,
            follow TEXT,
            follow_  TEXT
        )`);
        console.log('opened users.db');
    }
});
//Database for posts from users
const p_db = new sqlite3.Database( __dirname + '/posts.db',
function(err) {
    if ( !err ) {
        p_db.run(`
            CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY,
            time INTEGER,
            post TEXT,
            userid INTEGER
        )`);
        console.log('opened posts.db');
    }
});

const express = require('express');
const hbs = require('express-hbs');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const app = express();
// the static file middleware
app.use(express.static( __dirname + '/public'))

// the template middleware
// Use `.hbs` for extensions and find partials in `views/partials`.
app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views/partials',
  defaultLayout: __dirname + '/views/layout/main.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

const port = process.env.PORT || 8000;


function generate_notes_page( res ) {
    db.serialize( function () {
        db.all('SELECT position FROM notes',[], function(err, rows) {
            let pos = Object.keys(rows);
            let size = pos.length;
            // This makes sure there's always a note on the webpage 
            if (size == 0){
                db.run('INSERT INTO notes(note, position) VALUES(?, ?)',
                ["New Note", size]);
            }
            db.all('SELECT * FROM notes ORDER BY position ASC',[], function(err, results) {
                console.log(results);
                if ( !err ) {
                    res.type('.html');
                    res.render('notes', {
                        notes : results,
                        title : 'JSON and XMLHttpRequest'
                    });
                }
            } );
        } );
    } );
}

app.get('/', function(req, res) {
    generate_notes_page( res );
});

// REST API 
// get returns a user
// put updates a user
// delete removes a user


app.listen(port, () => console.log(`Listening on port ${port}!`));