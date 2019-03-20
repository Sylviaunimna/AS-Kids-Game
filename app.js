const sqlite3 = require('sqlite3').verbose();
var logger = require('morgan');
//Database for user information
const db = new sqlite3.Database( __dirname + '/users.db',
function(err) {
    if ( !err ) {
        console.log('opened users.db');
        initDB();
    }
});

function initDB() {
    db.serialize( function() {
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            fname TEXT,
            username TEXT,
            password TEXT, 
            score INTEGER
        )`);

    } );
}

const express = require('express');
const hbs = require('express-hbs');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const cookieSession = require('cookie-session');

const app = express();
app.use(logger('dev'));
// the static file middleware
const allowed_pages = [
    '/',
    '/login',
    'logdin',
    '/style.css',
    '/newlog.png',
    '/mjy.png',
    '/user-form.js',
    '/add-new-user',
    '/check-username',
    '/nelephant.jpg',
    '/elep.jpg',
    '/ngiraffe.jpg',
    '/gira.jpg',
    '/nlion.jpg',
    '/lio.jpg',
    '/parrot.jpg',
    '/par.jpg',
    '/tiger.jpg',
    '/tig.jpg',
    '/zebra.jpg',
    '/zeb.jpg',
    '/zebra.jpg',
    '/animal',
    '/logout',
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
        next(); 
    } 
    else{
        res.status(404).send('Page Not Found');
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

app.get('/login', function(req, res){
    res.type('.html')
    res.render('homepage', {
        sess: req.session,
        title : 'AS Social'
    });
    // console.log(req.session, "login");
   
    
})
app.get('/animal', function(req, res){
    res.type('.html')
    res.render('animals', {
        title : 'AS Social'
    });
    
})
app.get('/', function(req, res) {
    console.log(req.session, "home page");
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
    console.log("we're here")
    let authInfo = req.body;
    db.get('SELECT * FROM users where username= ?',
    [ authInfo.username ],
    function(err, row) {
        console.log("in database");
        if ( !err ) {
            console.log(row);
            if( row ) {
                if( (authInfo.password) === row.password ) {
                    req.session.auth = true;
                    // req.session.username = authInfo.username;
                    // req.session.password = authInfo.password
                    console.log("correct");
                    res.redirect('/login');
                    // res.send( { ok: true } );
                       
                }
                else {
                    req.session.auth = false;
                    console.log("incorrect pass")
                    res.send( { ok: false } );
                    //res.redirect('/')

                }
            }
            else {
                req.session.auth = false;
                console.log("not a user")
                res.send( { ok: false, msg : 'notuser' }
                 );
                 console.log(req.session);
                //res.redirect('/')

            }
        }
        else {
            req.session.auth = false;
            res.send( err );
        } 
    });
    
});

app.post('/logout', function(req, res){
    console.log("hellooooo")
    req.session.username = "None";
    req.session.password = "None";
    req.session.auth = false;
    console.log(req.session, "logout");
});






// REST API 
// get returns a user
// put updates a user
// delete removes a user

app.listen(port, () => console.log(`Listening on port ${port}!`));