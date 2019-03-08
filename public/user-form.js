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

function init_sign_in() {
    let button = document.getElementById( 'log-in');
    if ( !button ) {
        console.log('missing log-in');
        return;
    }
    button.addEventListener( 'click', (evt) => {
        document.getElementById('login_f').style.display = "block";
        let button = document.getElementById( 'sign-in-close');
        let login_button = document.getElementById("signin");

        if ( !button ) {
            console.log('missing sign-in-close');
            return;
        }
        
}
}
function authenticateUser(){
    button.addEventListener( 'click', (evt) => {
        document.getElementById('login_f').style.display = "none";
        let user_name = document.getElementById('uname1');
        let passwrd = document.getElementById("passwrd1");
        let obj = {username:user_name,password:passwrd}
        let uname = document.getElementById('uname1')
        let passwd = document.getElementById('passwrd1')
        
        req = new XMLHttpRequest();
        req.open("POST", `/login/${user_name}`);
        req.responseType = "json";
        req.onload = function(evt){
            if ( req.status == 200 ) {
                console.log(req.status);
                if(resp.status === "login"){
                    console.log( resp );
                    }
                }
                else {
                    console.log('err', req );
                }
            };
            console.log('sending', obj );
            req.send(JSON.stringify( obj ) );   
    } );
    login_button.addEventListener( 'click', (evt) => {
        let user_name = document.getElementById('uname1');
        let passwrd = document.getElementById("passwrd1");
        let obj = {username:user_name,password:passwrd}
        req = new XMLHttpRequest();
        req.open("GET", `/${user_name}`);
        req.responseType = "json";
        req.onload = function(evt){
            if ( req.status == 200 ) {
                console.log(req.status);
                if(resp.status === "login"){
                    console.log( resp );
                    }
                }
                else {
                    console.log('err', req );
                }
            };
            console.log('sending', obj );
            req.send(JSON.stringify( obj ) );   

    })
};


function init_sign_up() {
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
init_sign_in();
init_sign_up();
check_uname();
