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
            score INTEGER
        )`);
        console.log('opened users.db');
    }
});

const express = require('express');
const hbs = require('express-hbs');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const cookieSession = require('cookie-session');
const app = express();
// the static file middleware
const allowed_pages = [
    '/',
    '/login',
    '/style.css',
    '/newlog.png',
    '/mjy.png',
    '/user-form.js',
    '/add-new-user',
    '/check-username'
];
function generate_welcome_page( res,req ) {
    db.all('SELECT * FROM users ORDER BY score ASC',[], function(err, results) {
        if ( !err ) {
            res.type('.html');
            res.render('welcome', {
                users : results,
                title : 'Welcome to AS Social'
            });
        }
    } );
}
function check_auth(req, res, next){
    if ( req.session && req.session.auth ) {
        next();
    }
    else if ( allowed_pages.indexOf(req.url) !== -1 ) {
        console.log( req.url );
        next();
    }   
}
app.use(cookieSession({
    name:'session',
    secret:'foo'
 }));
 
app.use( check_auth );
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

app.get('/', function(req, res) {
    console.log(req)
    generate_welcome_page( res,req );
});

app.put('/check-username/', jsonParser, function(req,res){
    let user = req.body.username;
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

app.post('/add-new-user',jsonParser, function(req, res) {
    let fname = req.body.firstname;
    let uname = req.body.username;
    let pword = req.body.password;
    console.log("New User: ", uname);
    db.run('INSERT INTO users(fname, username, password, score) VALUES(?, ?, ?, ?)',
    [fname, uname, pword, null]);
    res.send( {fname : fname, uname : uname} ); 
});

app.post('/login',jsonParser, function(req, res){
    const authInfo = req.body;
    console.log(authInfo.username)
    db.get('SELECT * FROM users where username= ?',
    [ authInfo.username ],
    function(err, row) {
        if ( !err ) {
            if( row ) {
                if( (authInfo.password) == row.password ) {
                    req.session.auth = true;
                    req.session.user = authInfo.username;
                    res.send( { ok: true } );
                }
                else {
                    req.session.auth = false;
                    res.send( { ok: false } );
                }
            }
            else {
                req.session.auth = false;
                res.send( { ok: false, msg : 'notuser' } );
            }
        }
        else {
            req.session.auth = false;
            res.send( err );
        } 
    });
    
})






// REST API 
// get returns a user
// put updates a user
// delete removes a user

app.listen(port, () => console.log(`Listening on port ${port}!`));