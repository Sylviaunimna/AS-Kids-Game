const sqlite3 = require('sqlite3').verbose();
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
            admin INTEGER,
            gamesW INTEGER, 
            checked INTEGER,
            note TEXT
        )`);

    } );
}
test_users = [
    [ 'Sylvia', 'sylviax', '1234', 1, 14,""],
    [ 'Afrah', 'afrahx', '1234', 1, 15, ""],
    [ 'Mary', 'maryx', '1234', 0, 16, ""],
    [ 'Gillian', 'gillianx', '1234', 0, 10, ""],
    [ 'Bolu', 'bolux', '1234', 0, 0, ""],
    [ 'Oyin', 'oyinx', '1234', 0, 0, ""],
    [ 'Dani', 'danix', '1234', 0,  12, ""],
    [ 'Dadi', 'dadix', '1234', 0, 14, ""],
    [ 'Nafsa', 'nafsax', '1234', 0, 5, ""],
    [ 'Khalid', 'khalidx', '1234', 0, 8, ""],
];
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
    'logdin',
    '/style.css',
    '/newlog.png',
    '/brain.png',
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
    '/update-not',
    '/tig.jpg',
    '/zebra.jpg',
    '/zeb.jpg',
    '/get-leaderboard',
    '/zebra.jpg',
    '/animal',
    '/logout',
    '/admin',
    '/update-checked',
    'is-checked',
    '/levelselect.png',
    '/smiley.jpg',
    '/update-p',
    '/insert',
    '/update-won',
    '/vendor/bootstrap/css/bootstrap.min.css',
    '/images/icons/favicon.ico',
    '/fonts/font-awesome-4.7.0/css/font-awesome.min.css',
    '/fonts/Linearicons-Free-v1.0.0/icon-font.min.css',
    '/vendor/animate/animate.css',
    '/vendor/css-hamburgers/hamburgers.min.css',
    '/vendor/animsition/css/animsition.min.css',
    '/vendor/select2/select2.min.css',
    '/css/util.css',
    '/css/main.css',
    '/fonts/ubuntu/Ubuntu-Regular.ttf',
    '/modifyUser',
    '/slidepuzzle'
];
function generate_welcome_page( res,req ) {
    if(req.session.auth){
       forLogin(req, res);
    }
    else{
        res.type('.html');
        res.render('welcome', {
            title : 'AS'
        });
    }
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
app.use(express.static(__dirname + '/images'));
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
app.get('/slidepuzzle',function(req,res){
    res.type('.html')
    res.render('slidePuzzle', {
        title : 'AS Social'
    });

})
app.get('/login', function(req, res){
    if(req.session.auth){
        forLogin(req, res);
    }
    else{
        res.type('.html');
        return res.render('welcome', {
            sess: req.session,
            title : 'AS'
        });
    }
});
function forLogin(req, res){
    var index;
    db.serialize(function(){
        db.all('SELECT username FROM users ORDER BY gamesW DESC',[], function(err, results) {
            if ( !err ) {
                let size = Object.keys(results).length;
                for(var i=0; i < size; i++){
                    if (results[i].username === req.session.username){
                       index = i+1;
                    }
                }
                db.all('SELECT username, gamesW FROM users ORDER BY gamesW DESC LIMIT 5',[], function(err, results) {
                    let msize = Object.keys(results).length;
                    if ( !err ) {
                        for(var i=0; i < msize; i++){
                            results[i].i = i+1;
                            if (results[i].username == req.session.username){
                                results[i].is = false;
                            }
                            else{
                                results[i].is = true;
                            }
                        }
                        //To display any notifications the user may have
                        db.get('SELECT note FROM USERS WHERE username = ?', [req.session.username], function(err, notis) {
                            let note = notis.note
                            let rnote = note.split(',');
                            rnote.shift();
                            let sizee = rnote.length;
                    
                            db.get('SELECT gamesW FROM USERS WHERE username = ?', [req.session.username], function(err, score) {
                        
                                console.log("Logged In: ",req.session);
                                res.type('.html');
                                return res.render('homepage', {
                                    score: score,
                                    size: sizee, 
                                    notifs: rnote,
                                    index: index,
                                    users: results,
                                    letter1: req.session.fname.charAt(0).toUpperCase(),
                                    sess: req.session,
                                    title : 'AS'
                                });
                            });
                        });
                    }
                } );
            }
                
        } );
    });
}
app.get('/admin',function(req,res){
    db.all(`SELECT * FROM users WHERE admin=0 ORDER BY gamesW DESC`,[],function(err,row){
        res.type('.html');
        res.render('admin',{
            users : row
        });
    });
});
app.get('/animal', function(req, res){
    if(req.session.auth){
        res.type('.html')
        res.render('animals', {
            title : 'AS'
        });
    }
    else{
        res.type('.html');
        return res.render('welcome', {
            sess: req.session,
            title : 'AS'
        });
    }
    
});
//insert users into the database
app.get('/insert',jsonParser, function(req, res){
    for( let row of test_users ) { 

        db.run('INSERT INTO users(fname,username, password, admin, gamesW, note) VALUES(?,?,?,?,?,?)', row,
           (err) => {
               if ( err ) {
                   console.log( err );
               } else {
                   console.log('insert', row );
               }
        } );
    }
});
app.get('/', function(req, res) {
    console.log("Current User: ", req.session);
    generate_welcome_page( res,req );
});

app.get('/fnameSort',function(req,res){
    db.all('SELECT id,fname,username,gamesW FROM users WHERE admin=0 ORDER BY fname',[],function(err,rows){
        if(!err){
            res.send(rows)
        }
    })
})
app.get('/unameSort',function(req,res){
    db.all('SELECT id,fname,username,gamesW FROM users WHERE admin=0 ORDER BY username',[],function(err,rows){
        if(!err){
            console.log(rows)
            res.send(rows)
        }
    })
})
app.get('/idSort',function(req,res){
    db.all('SELECT id,fname,username,gamesW FROM users WHERE admin=0 ORDER BY id',[],function(err,rows){
        if(!err){
            res.send(rows)
        }
    })
})
app.get('/scoreSort',function(req,res){
    db.all('SELECT id,fname,username,gamesW FROM users WHERE admin=0 ORDER BY gamesW',[],function(err,rows){
        if(!err){
            res.send(rows)
        }
    })
})
//This determines if the popup shows up everytime the user logs in
app.put('/update-checked',jsonParser, function(req, res){
    let bool = req.body.bool;
    db.run('UPDATE users SET checked=? WHERE username=?',
    [bool, req.session.username], function(err) {
        if (!err) {
            res.send( {status : 'updated'} );
        }
        else {
            res.send( {error : err} );
        }
    });
});
app.delete('/deleteUser',jsonParser,function(req,res){
    let id = req.body.id;
    console.log(id);
    db.serialize(function(){
    db.run(`DELETE FROM users WHERE id=?`,[id],function(err) {
        if (!err) {
            res.send( {status : 'deleted'} );
        }
        else {
            res.send( {error : err} );
        }
    });
    db.all(`SELECT id FROM users ORDER BY gamesW DESC`,[],function(err,row){
        if (!err){
            console.log(row);
        }
    })

    
    })
})
app.put('/delete-notification',jsonParser,function(req,res){
    let id = req.body.id;
    db.run(`UPDATE users SET note=? WHERE id=? `,["",id],function(err){
        if (!err) {
            res.send( {status : 'updated'} );
        }
        else {
            res.send( {error : err} );
        }
    });
})
app.put('/delete-score',jsonParser,function(req,res){
    let id = req.body.id;
    console.log(id)
    db.run(`UPDATE users SET gamesW=? WHERE id=? `,[0,id],function(err){
        if (!err) {
            res.send( {status : 'updated'} );
        }
        else {
            res.send( {error : err} );
        }
    });
})

app.put('/modifyUser',jsonParser,function(req,res){
    let newUname = req.body.username;
    let id = req.body.id;
    db.run(`UPDATE users SET username=? WHERE id=? `,[newUname,id],function(err){
        if (!err) {
            res.send( {status : 'updated'} );
        }
        else {
            res.send( {error : err} );
        }
    });
})
//updates score
app.put('/update-p',jsonParser, function(req, res){
    let oldp = req.body.oldp;
    let newp = req.body.newp;
    db.serialize(function(){
        db.get('SELECT password FROM users WHERE username=?',[req.session.username], function(err, result) {
            if (result.password !== oldp){
                res.send( {status : 'notupdated'} );
            }
            else{
                db.run('UPDATE users SET password=? WHERE username=?',
                [newp, req.session.username], function(err) {
                    if (!err) {
                        req.session.password = newp;
                        res.send( {status : 'updated'} );
                    }
                    else {
                        res.send( {error : err} );
                    }
                });
            }
        });
        
    });
});
//updates number of games won
app.put('/update-won',jsonParser, function(req, res){
    db.serialize(function(){
        db.get('SELECT gamesW FROM users WHERE username=?',[req.session.username], function(err, result) {
            db.run('UPDATE users SET gamesW=? WHERE username=?',
            [result.gamesW+1, req.session.username], function(err) {
                if (!err) {
                    res.send( {status : 'updated'} );
                }
                else {
                    res.send( {error : err} );
                }
            });
        });
        
    });
});
//checks to see if user previously selected not to show the popup
app.put('/is-checked',jsonParser, function(req, res){
    db.get('SELECT checked FROM users where username= ?',
    [ req.session.username ], function(err, checked) {
        if (checked.checked == 1) {
            res.send( {status : true} );
        }
        else {
            res.send( {status : false} );
        }
    });
});
app.post('/add-new-user',jsonParser, function(req, res) {
    let fname = req.body.firstname;
    let uname = req.body.username;
    let pword = req.body.password;
    db.serialize( function(){
        db.get('SELECT COUNT(*) as user_exists FROM users WHERE username=?',[uname],function(err,exist){
            if(!err){
                if(exist.user_exists > 0){
                    res.send({status:"notok"});
                }
                else{
                    console.log("New User: ", uname);
                    db.run('INSERT INTO users(fname, username, password, gamesW, note) VALUES(?, ?, ?, ?, ?)',
                    [fname, uname, pword, 0, ""]);
                    res.send( {status: "ok"} ); 
                }
            }
            else{
                res.send({error:err})
            }
        })
    })

});
app.post('/login',jsonParser, function(req, res){
    let authInfo = req.body;
    db.get('SELECT * FROM users where username= ?',
    [ authInfo.username ],
    function(err, row) {
        if ( !err ) {
            if( row ) {
                if( (authInfo.password) === row.password ) {
                    req.session.auth = true;
                    req.session.username = authInfo.username;
                    req.session.password = authInfo.password
                    req.session.fname = row.fname;
                    res.redirect('/login');
                }
                else {
                    req.session.auth = false;
                    console.log("incorrect pass")
                    res.status(401);
                    res.send( { ok: false } );
                }
            }
            else {
                req.session.auth = false;
                console.log("not a user")
                res.status(403);
                res.send( { ok: false, msg : 'notuser' });

            }
        }
        else {
            req.session.auth = false;
            res.send( err );
        } 
    });
    
});
app.post('/logout', function(req, res){
    req.session.username = "None";
    req.session.password = "None";
    req.session.auth = false;
    res.redirect('/');
});
app.put('/get-leaderboard', function(req, res){
    db.all('SELECT username, gamesW FROM users ORDER BY gamesW DESC LIMIT 5',[], function(err, results) {
    if ( !err ) {
        res.send({result : results});
    }
    })
});

app.put('/update-not',jsonParser, function(req, res){
    let user = req.body.user;
    db.serialize(function(){
        db.get('SELECT note FROM users WHERE username=?',[user], function(err, result) {
            let string = result.note;
            let rnote = string.split(',');
            rnote.shift();
            let size = rnote.length;
            if (size >= 5){
                res.send( {status : 'notupdated'} );
            }
            else if (rnote.includes(req.session.username)){
                res.send( {status : 'alreadyexists'} ); 
            }
            else{
                newn = string + "," + req.session.username;
                db.run('UPDATE users SET note=? WHERE username=?',
                [newn, user], function(err) {
                    if (!err) {
                        res.send( {status : 'updated', info: newn} );
                    }
                    else {
                        res.send( {error : err} );
                    }
                });
            }
        });
        
    });
});
app.listen(port, () => console.log(`Listening on port ${port}!`));