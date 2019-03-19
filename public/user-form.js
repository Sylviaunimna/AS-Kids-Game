class GamePage extends HTMLElement {
    constructor() {
        super();  // is always required
        const thisForm = this;

        const gameArea = document.getElementById('anim');
        let prevtarget = null;
        let score = 0;
        gameArea.addEventListener('click', function(evt){
            if (prevtarget == null){
                prevtarget = evt.target;  
                if (prevtarget.hasAttribute('wid')){
                    prevtarget.setAttribute('style', 'outline: 1px solid white' )
                }
            }
            else{
                let target = evt.target;
                if (target.hasAttribute('wid')){
                    prevtarget.removeAttribute('style');
                    if (target.getAttribute('wid') == prevtarget.getAttribute('wid') && target.getAttribute('id') != prevtarget.getAttribute('id')){
                        prevtarget.parentNode.removeChild(prevtarget);
                        target.parentNode.removeChild(target);
                        score ++;
                        let texta = document.getElementById('score');
                        texta.value = "Score: " + score;
                        prevtarget = null;
                        if (score == 6){
                            document.getElementById('donepop').style.display = "block";
                        }
                    }
                    else{
                        document.getElementById('wrongpop').style.display = "block";
                        prevtarget = null;
                        let wrong = document.getElementById( 'wrong-close');
                        wrong.addEventListener( 'click', (evt) => {
                            document.getElementById('wrongpop').style.display = "none";
                        } );
                    }
                }
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
            let obj = {firstname:fname, username:uname,password:pword}
            let req = new XMLHttpRequest();
            req.open('POST','/add-new-user');
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
            req.send(JSON.stringify( obj ));
        } );
        
        let uname = document.getElementById('uname');
        uname.addEventListener( 'change', (evt) => {
            console.log('change', evt);
            let user = document.getElementById( 'uname').value;
            let obj = {username:user}
            console.log(user);

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

        let button1 = document.getElementById( 'log-in');
        button1.addEventListener( 'click', function(evt){
            document.getElementById('login_f').style.display = "block"; //popup form
            let closeb = document.getElementById('sign-in-close');
            let login_button = document.getElementById("signin"); //the main sign in button to call the app.js
            closeb.addEventListener('click', function(evt){
                //document.getElementById('login_f').style.display = "none";
            });
            login_button.addEventListener('click', function(evt){
                let user = document.getElementById( 'uname1').value;
                let password = document.getElementById('passwrd1').value;
                authenticateUser(user,password,(req)=>{
                    if ( req.status == 200 ) { 
                        let res = req.response;
                        if ( res.ok ) {
<<<<<<< HEAD
                            login_button.setAttribute('href','/login')
                            console.log(res.ok)
                            
=======
                            login_button.setAttribute('href', "/login")
                            //login_button.href = "/login";
>>>>>>> 997a3d0b3bd091ceee5dd8c651c8580a09a68bf6
                        }
                        else {
                            login_button.setAttribute('href','/')
                            notloggedIn();
                        }
<<<<<<< HEAD
                    }
                           
=======
                        
                    }     
>>>>>>> 997a3d0b3bd091ceee5dd8c651c8580a09a68bf6
                })   
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

<<<<<<< HEAD



=======
>>>>>>> 997a3d0b3bd091ceee5dd8c651c8580a09a68bf6
function authenticateUser(user,password,callback){
    let req = new XMLHttpRequest();
    console.log(user)
    let obj = {username : user, password : password}
    console.log(obj)
    req.open('POST','/login');
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.responseType = 'json';
    req.onload = function(evt) { callback( req ); };
    req.send( JSON.stringify( obj ));  
};

<<<<<<< HEAD

=======
>>>>>>> 997a3d0b3bd091ceee5dd8c651c8580a09a68bf6
function notloggedIn(){
    let req = new XMLHttpRequest();
    req.open('GET','/');
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.onload = function(evt) {
        if ( req.status == 200 ) {
            console.log(req.status)
        }
        else {
            console.log('err', req );
        }
    }
    req.send();
}

// function show_tips(){
//     //call app.js on the user to deterine if the user wants to be shown tips 
//     let button = document.getElementById('next1');
//     button.addEventListener('click', function(evt){
//         document.getElementById(tips_1).style.display = "none";

//     });
// }

customElements.define('initial-page', InitialPage)



customElements.define('game-page', GamePage);
