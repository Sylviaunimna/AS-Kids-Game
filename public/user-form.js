
function init_sign_up(){
    let button = document.getElementById( 'signup');
    button.addEventListener( 'click', (evt) => {
        //get the paremeters from the form
        let fname = document.getElementById( 'first').value;
        let uname = document.getElementById( 'uname').value;
        let pword = document.getElementById( 'password').value;
        let obj = {firstname: fname, username: uname, password:pword};
        let req = new XMLHttpRequest();
        req.open('POST',`/add-new-user`);
        req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        req.responseType = 'json'; 
        req.onload = function(evt) {
            if ( req.status == 200 ) { // check for ok response
                const user = req.response;
                console.log( user );
                console.log("made user")
            }
            else {
                console.log('err', req );
            }
            //still don;t know if we will tell user to sign in
        };
        req.send(JSON.stringify( obj ));
    } );

}
function check_uname() {
    let uname = document.getElementById('uname');
    uname.addEventListener( 'change', (evt) => {
        console.log('change', evt);
        let user = document.getElementById( 'uname').value;

        // console.log(user);
        // get inputs 

        console.log(user);
        let obj = {username:user}
        let req = new XMLHttpRequest();
        req.open('PUT', `/check-username`);
        req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        req.responseType = 'json'; 
        req.onload = function(evt) {
            console.log(req.status)
            if ( req.status == 200 ) { // check for ok response
                const resp = req.response;
                
                if ( resp.status === 'exists' ) {
                   
                    document.getElementById('e_pop').style.display = "block";
                    let button = document.getElementById( 'e_pop-close');
                    
                    button.addEventListener( 'click', (evt) => {
                        document.getElementById('e_pop').style.display = "none";
                    } );
                }
                console.log( resp );
            }
            else {
                console.log('err', req );
            }
        };
        req.send(JSON.stringify( obj ));
    } );

}
function authenticateUser(user,password,callback){
    let req = new XMLHttpRequest();
    let obj = {username : user, password : password}
    req.open('POST','/login');
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.responseType = 'json';
    req.onload = function(evt) { callback( req ); };
    req.send( JSON.stringify( obj ));  
};

function popup_sign_in() {
    let button = document.getElementById( 'log-in');
    button.addEventListener( 'click', function(evt){
        document.getElementById('login_f').style.display = "block"; //popup form
        let closeb = document.getElementById('sign-in-close');
        let login_button = document.getElementById("signin"); //the main sign in button to call the app.js
        closeb.addEventListener('click', function(evt){
            document.getElementById('login_f').style.display = "none";
        });
        login_button.addEventListener('click', function(evt){
            let user_name = document.getElementById('uname1').value;
            let passwrd = document.getElementById("passwrd1").value;
            authenticateUser(user_name,passwrd,( req ) => {

                if ( req.status == 200 ) { 
                    let res = req.response;
                    console.log(res.ok)
                    if ( res.ok ) {
                        console.log("hi")
                        document.getElementById('login_f').style.display = "none" 
                    }
                }
                    }) 
        });
        
    })
}


function popup_sign_up() {
    let button = document.getElementById( 'sign-up');
    if ( !button ) {
        console.log('missing sign-up');
        return;
    }
    button.addEventListener( 'click', (evt) => {
        document.getElementById('signup_f').style.display = "block";
        let button = document.getElementById( 'sign-up-close');
        if ( !button ) {
            console.log('missing sign-up-close');
            return;
        }
        button.addEventListener( 'click', (evt) => {
            document.getElementById('signup_f').style.display = "none";
           
        } );
    } );
}
function show_tips(){
    //call app.js on the user to deterine if the user wants to be shown tips 
    let button = document.getElementById('next1');
    button.addEventListener('click', function(evt){
        document.getElementById(tips_1).style.display = "none";

    });
}
//customElements.define('user-form', UserForm );

popup_sign_in();
popup_sign_up();
check_uname();
init_sign_up();


