// custom element for user form
class UserForm extends HTMLElement {
    constructor() {
        super();  // is always required
        const thisForm = this;
        const line = document.createElement('div');
        line.setAttribute('class','note');
        this.append(line);
    }
}

//This function checks to see if the username already exists 

function init_sign_up(){
    let button = document.getElementById( 'signup');
    button.addEventListener( 'click', (evt) => {
        //get the paremeters from the form
        let fname = document.getElementById( 'first').value;
        let uname = document.getElementById( 'uname').value;
        let pword = document.getElementById( 'password').value;
        let email = document.getElementById( 'email').value;
        
        let req = new XMLHttpRequest();
        req.open('POST',`/add-new-user/${fname}/${uname}/${pword}/${email}`);
        req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        req.responseType = 'json'; 
        req.onload = function(evt) {
            if ( req.status == 200 ) { // check for ok response
                const user = req.response;
                console.log( user );
            }
            else {
                console.log('err', req );
            }
            //still don;t know if we will tell user to sign in
        };
        req.send();
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

        let req = new XMLHttpRequest();
        req.open('PUT', `/check-username/${user}`);
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
        req.send();
    } );

}

function popup_sign_in() {
    let button = document.getElementById( 'log-in');
    if ( !button ) {
        console.log('missing log-in');
        return;
    }
    button.addEventListener( 'click', (evt) => {
        document.getElementById('login_f').style.display = "block";
        let closeb = document.getElementById( 'sign-in-close');
        let login_button = document.getElementById("signin"); //the main sign in button to call the app.js
        closeb.addEventListener('click', function(evt){
            document.getElementById('login_f').style.display = "none";
        });
        login_button.addEventListener('click', function(evt){
            authenticateUser()  
        });
        
    })
}

function authenticateUser(){
        let user_name = document.getElementById('uname1').value;
        let passwrd = document.getElementById("passwrd1").value;
        let obj = {username : user_name, password : passwrd}
        console.log(obj.username)
        req = new XMLHttpRequest();
        req.open("POST", '/login');
        req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        req.responseType = "json";
        req.onload = function(evt){
            if ( req.status == 200 ) {
                if(resp.status === "login"){
                    document.getElementById('login_f').style.display = "none";
                    console.log( resp );
                    }
            }
            else {
                console.log('err', req );
            }
        };
        console.log('sending', obj );
        req.send(JSON.stringify( obj ) );   
    
};


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

//customElements.define('user-form', UserForm );

popup_sign_in();
popup_sign_up();
check_uname();
init_sign_up();


