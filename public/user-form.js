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