const sqlite3 = require('sqlite3').verbose();
//Database for user information
const db = new sqlite3.Database( __dirname + '/users.db',
function(err) {
    if ( !err ) {
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            fname TEXT,
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
// const cookieSession = require('cookie-session');
const app = express();
// the static file middleware
app.use(express.static( __dirname + '/public'))
// app.use(cookieSession({
//     name:'session',
//     secret:'foo'
// }));
// the template middleware
// Use `.hbs` for extensions and find partials in `views/partials`.
app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views/partials',
  defaultLayout: __dirname + '/views/layout/main.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

const port = process.env.PORT || 8000;


function generate_welcome_page( res,req ) {
    res.type('.html');
    res.render('welcome', {
        title : 'Welcome to AS Social',
        sess : req.session
    });
}
app.post('/login',function(req,res){
    if (req.body.username){
        req.session.username = req.body.username
    }
    if(req.body.password){
        req.session.password = req.body.password
    }
    console.log(req.session.password)

})
function check_password(req,res,next){
    db.serialize(function(){
    db.get('SELECT password FROM users WHERE username=?',[req.session.username],function(err,psswd){
        console.log(psswd.password)
        if(psswd.password == req.session.password){
            next()
        }
        else(
            res.end('not a user')
        )
    })
})
}
app.get('/:user',check_password,function(req,res){
    res.end("Hello user")
})

app.get('/', function(req, res) {
    //we could check to see if user was previously signed in 
    generate_welcome_page( res,req );
});

app.put('/check-username/:user', jsonParser, function(req,res){
    let user = req.params.user;
    db.get('SELECT COUNT(*) as user_exists FROM users WHERE username=?',[user],function(err,exist){
        if(!err){
           
            if(exist.user_exists > 0){
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

});

app.post('/add-new-user/:fname/:uname/:pword/:email', function(req, res) {
    let fname = req.params.fname;
    let uname = req.params.uname;
    let pword = req.params.pword;
    let email = req.params.email;
    console.log("New User: ", uname);
    db.run('INSERT INTO users(fname, username, password, email, follow, follow_) VALUES(?, ?, ?, ?, ?, ?)',
    [fname, uname, pword, email, null, null]);
    res.send( {fname : fname, uname : uname, email : email} ); 
});







// REST API 
// get returns a user
// put updates a user
// delete removes a user

app.listen(port, () => console.log(`Listening on port ${port}!`));