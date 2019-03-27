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
                        prevtarget = null;
                    }
                }
            }
        })
    }
}
class AdminPage extends HTMLElement{
    constructor(){
        super();
        const thisForm = this;
        let viewButton = document.getElementById("viewUsers");
        let closeTableButton = document.getElementById("closeTable");
        let deleteButton = document.getElementById("deleteUser");
        let addLvlButton = document.getElementById("addLevel");
        let tableArea = document.getElementById("UserTable");
        let users = document.getElementById("users");
        viewButton.addEventListener('click',(evt)=>{
            console.log("button")
            users.style.display = "block";
    })
    
    closeTableButton.addEventListener('click',(evt)=>{
        users.style.display = "none";
    })
    tableArea.addEventListener('click',(evt)=>{
        const target = evt.target;
            const nodeName = target.nodeName;
            let p =target.parentNode.nodeName;
            let name = target.getAttribute('name');
            
            console.log(nodeName);
            if(nodeName == "TD" && name == "user"){
               isSelected(target);
               console.log(theSelected);
            }
            deleteButton.addEventListener('click',(evt)=>{
                if(theSelected){
                    let useId = theSelected.parentNode.getAttribute('id')
                    console.log(useId)
                    deleteUser(theSelected.parentNode,useId);
                    theSelected = null;
                }
            })
            //ToDo After all the game are made
            addLvlButton.addEventListener('click',(evt)=>{
                if(theSelected){
                    let row = theSelected.parentNode
                    let useId = row.getAttribute('id')
                    let data = row.children
                    console.log(data[2].textContent)
                    if(data[2].textContent == 6){
                        console.log("isZero")
                        modifyUser(row,useId);
                        data[5].textContent = 1;
                    }
                }
            })
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
                    const res = req.response;
                    document.getElementById('signup_f').style.display = "none";
                    if(res.status == "ok"){
                        document.getElementById('success_f').style.display = "block";
                        let sclose = document.getElementById('s-close');
                        sclose.addEventListener( 'click', (evt) => {
                            document.getElementById('success_f').style.display = "none";
                        
                        } );
                    }
                    else{
                        document.getElementById('error_f').style.display = "block";
                        let eclose = document.getElementById('e-close');
                        eclose.addEventListener( 'click', (evt) => {
                            document.getElementById('error_f').style.display = "none";
                        
                        } );
                    }
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
            let closeb = document.getElementById('close');
            let login_button = document.getElementById("signin"); //the main sign in button to call the app.js
            closeb.addEventListener('click', function(evt){
                document.getElementById('login_f').style.display = "none";
            });
            login_button.addEventListener('click', function(evt){
                let user = document.getElementById( 'uname1').value;
                let password = document.getElementById('passwrd1').value;
                authenticateUser(user,password,(req)=>{
                    if ( req.status == 200 ) { 
                        //need to check if it's legit     
                    }     
                })   
            });
        });
        
        let button2 = document.getElementById( 'sign-up');
        button2.addEventListener( 'click', (evt) => {
            document.getElementById('signup_f').style.display = "block";
            let button = document.getElementById('up-close');
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

let theSelected = null;
function isSelected(user){
    if(theSelected && theSelected != null){
        theSelected.setAttribute('class',''); 
    }
    theSelected = user;
if ( user && user != null) {
    theSelected.setAttribute('class','highlight');
}
}
function modifyUser(userRow,id){
    let req = new XMLHttpRequest();
    req.open('PUT', `/modifyUser/${id}`); 
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.responseType = 'json'; 
    req.onload = function(evt) {
        if ( req.status == 200 ) { // check for ok response
            const resp = req.response;
            console.log( resp );
        }
        else {
            console.log('err', req );
        }
    };
    req.send();
}
function deleteUser( userRow, id ) {
    let req = new XMLHttpRequest();
    req.open('DELETE', `/deleteUser/${id}`);
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.responseType = 'json';
    req.onload = function(evt) {
        if ( req.status == 200 ) { // check for ok response
            const resp = req.response;
            console.log( resp );
            userRow.remove();
        }
        else {
            console.log('err', req );
        }
    };
    req.send();
}

function authenticateUser(user,password,callback){
    let req = new XMLHttpRequest();
    console.log(user)
    let obj = {username : user, password : password}
    console.log(obj)
    req.open('GET','/login');
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.responseType = 'json';
    req.onload = function(evt) { callback( req ); };
    req.send( JSON.stringify( obj ));  
};

function notloggedIn(){
    let req = new XMLHttpRequest();
    req.open('GET','/');
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
class HomePage extends HTMLElement {
    constructor() {
        super();  // is always required
        const thisForm = this;
        // we would call a function to check if user selected do not show again.
        document.getElementById('first').style.display = "block"
        let button1 = document.getElementById('next1');
        var checked;
        button1.addEventListener('click', function(evt){
            document.getElementById('first').style.display = "none";
            document.getElementById('tips_2').style.display = "block";
            let tipsb = document.getElementById('tips-close');
            tipsb.addEventListener('click', function(evt){
                checked = document.getElementById("donots").checked;
                // let obj = {bool:checked}
                // let req = new XMLHttpRequest();
                // req.open('PUT','/update-checked');
                // req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
                // req.responseType = 'json'; 
                // req.onload = function(evt) {
                //     if ( req.status != 200 ) { // check for ok response
                //         console.log('err', req );
                //     }
                // };
                // req.send(JSON.stringify( obj ));
                document.getElementById('tips_2').style.display = "none";
            });
        });

        let button2 = document.getElementById('editp')
        button2.addEventListener('click', function(evt){
            document.getElementById('edit_p').style.display = "block";
            let closeb = document.getElementById('sign-in-close');
            closeb.addEventListener('click', function(evt){
                document.getElementById('edit_p').style.display = "none";
            });
        })
            var coll = document.getElementsByClassName("collapsible");
            var i;

            for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function() {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.maxHeight){
                content.style.maxHeight = null;
                } else {
                content.style.maxHeight = content.scrollHeight + "px";
                } 
            });
            }

        //     let logb = document.getElementById( 'logoutb');
        // logb.addEventListener( 'click', (evt) => {
        //     let req = new XMLHttpRequest();
        //     console.log("hello");
        //     req.open('POST','/logout');
        //     req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        //     req.responseType = 'json'; 
        //     req.onload = function(evt) {
        //         if ( req.status == 200 ) { // check for ok response
        //             // const user = req.response;
        //             // console.log( user );
        //         }
        //         else {
        //             console.log('err', req );
        //         }
        //     };
        //     req.send();
        // } );
    }
}
customElements.define('home-page', HomePage);
customElements.define('initial-page', InitialPage);
customElements.define('game-page', GamePage);
