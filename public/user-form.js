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
        // get inputs 
        let req = new XMLHttpRequest();
        req.open('PUT', `/check-username/${user}`);

        req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        //req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        req.responseType = 'json'; 
        req.onload = function(evt) {
            console.log(req.status)
            if ( req.status == 200 ) { // check for ok response
                const resp = req.response;
                console.log(resp.status);
                if ( resp.status === 'exists' ) {
                    document.getElementById('e_pop').style.display = "block";
                }
                console.log( resp );
            }
            else {
                console.log('err', req );
            }
        };
<<<<<<< HEAD
    req.send()
=======
        req.send();
>>>>>>> e15afed699fc4e7317bfc07adeda593ba8efa174
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
    } );
}
function init_sign_in_close() {
    let button = document.getElementById( 'sign-in-close');
    if ( !button ) {
        console.log('missing sign-in-close');
        return;
    }
    button.addEventListener( 'click', (evt) => {
        document.getElementById('login_f').style.display = "none";
    } );
}
function init_sign_up() {
    let button = document.getElementById( 'sign-up');
    if ( !button ) {
        console.log('missing sign-up');
        return;
    }
    button.addEventListener( 'click', (evt) => {
        document.getElementById('signup_f').style.display = "block";
    } );
}
function init_sign_up_close() {
    let button = document.getElementById( 'sign-up-close');
    if ( !button ) {
        console.log('missing sign-up-close');
        return;
    }
    button.addEventListener( 'click', (evt) => {
        document.getElementById('signup_f').style.display = "none";
    } );
}
//customElements.define('user-form', UserForm );
init_sign_in();
init_sign_in_close();
init_sign_up();
init_sign_up_close();
check_uname();