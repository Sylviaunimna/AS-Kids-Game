class GamePage extends HTMLElement {
    constructor() {
        super();  // is always required
        const thisForm = this;

        const gameArea = document.getElementById('anim');
        gameArea.addEventListener('click', function(evt){
            let target = evt.target;
            let noden = target.nodeName;
            if (noden == "DIV" || noden == "IMG"){
                console.log(target.getAttribute('wid'));
            }
        })
    }
}
class InitialPage extends HTMLElement {
    constructor() {
        super();  // is always required
        const thisForm = this;

        let button = document.getElementById( 'signup');
        button.addEventListener( 'click', (evt) => {
            //get the paremeters from the form
            let fname = document.getElementById( 'first').value;
            let uname = document.getElementById( 'uname').value;
            let pword = document.getElementById( 'password').value;
            
            let req = new XMLHttpRequest();
            req.open('POST',`/add-new-user/${fname}/${uname}/${pword}`);
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
        
        let uname = document.getElementById('uname');
        uname.addEventListener( 'change', (evt) => {
            console.log('change', evt);
            let user = document.getElementById( 'uname').value;

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

        let button1 = document.getElementById( 'log-in');
        button1.addEventListener( 'click', function(evt){
            document.getElementById('login_f').style.display = "block"; //popup form
            let closeb = document.getElementById('sign-in-close');
            let login_button = document.getElementById("signin"); //the main sign in button to call the app.js
            closeb.addEventListener('click', function(evt){
                document.getElementById('login_f').style.display = "none";
            });
            login_button.addEventListener('click', function(evt){
                console.log("hey");
                //authenticateUser();
                req = new XMLHttpRequest();
                req.open("GET", `/login`);
                req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
                req.responseType = "json";
                req.onload = function(evt){
                    if ( req.status == 200 ) {
                        //login_button.addAttribute('href', '/login');
                        //req.redirect('/login');
                        // if(resp.status === "login"){
                        //     // document.getElementById('login_f').style.display = "none";
                        //     console.log( resp );
                        // }
                    }
                    else {
                        console.log('err', req );
                    }
                };
                req.send();   
            });
            
        });
        
        let button2 = document.getElementById( 'sign-up');
        button2.addEventListener( 'click', (evt) => {
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
}


function show_tips(){
    //call app.js on the user to deterine if the user wants to be shown tips 
    let button = document.getElementById('next1');
    button.addEventListener('click', function(evt){
        document.getElementById(tips_1).style.display = "none";

    });
}
customElements.define('initial-page', InitialPage)



customElements.define('game-page', GamePage);
