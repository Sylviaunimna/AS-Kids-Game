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
    let button = document.getElementById( 'sign-in');
    if ( !button ) {
        console.log('missing sign-in');
        return;
    }
    button.addEventListener( 'click', (evt) => {
        document.getElementById('myForm').style.display = "block";
    } );
}
function init_sign_in_close() {
    let button = document.getElementById( 'sign-in-close');
    if ( !button ) {
        console.log('missing sign-in-close');
        return;
    }
    button.addEventListener( 'click', (evt) => {
        document.getElementById('myForm').style.display = "none";
    } );
}

customElements.define('user-form', UserForm );
init_sign_in();
init_sign_in_close();