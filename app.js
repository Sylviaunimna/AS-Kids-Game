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


function generate_welcome_page( res ) {
    res.type('.html');
    res.render('welcome', {
        title : 'Welcome to AS Social'
    });
    db.run('INSERT into users (username, password,email,follow,follow_) VALUES(?,?,?,null,null)',["sylvia","1234","sunimna@mun.ca"]);
    
}

app.get('/', function(req, res) {
    //we could check to see if user was previously signed in 
    generate_welcome_page( res );
});
app.post('/check-username/:user',function(req,res){
    console.log("Hi! i'm sylvia");
    let user = req.params.user;
    db.get('SELECT COUNT(1) as user_exists FROM users WHERE username=?',[user],function(err,exist){
        if(!err){
            if(exist.user_exists == 1){
                res.send({status:"exists"});
            }
            else{
                res.send({status:"not"})
            }
        }
        else{
            res.send({error:err})
        }
    })
})

// REST API 
// get returns a user
// put updates a user
// delete removes a user

app.listen(port, () => console.log(`Listening on port ${port}!`));