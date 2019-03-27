class GamePage extends HTMLElement {
    constructor() {
        super();  
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
                            let req = new XMLHttpRequest();
                            req.open('PUT','/update-won');
                            req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
                            req.responseType = 'json'; 
                            req.onload = function(evt) {
                                if ( req.status === 200 ) { // check for ok response
                                    if (req.response.status == "updated"){
                                        console.log('updated score');
                                    }
                                }
                            };
                            req.send();
                        }
                    }
                    else{
                        prevtarget = null
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
        let button = document.getElementById( 'signup');
        button.addEventListener( 'click', (evt) => {
            let fname = document.getElementById( 'first').value;
            let uname = document.getElementById( 'uname').value;
            let pword = document.getElementById( 'password').value;
            let rpword = document.getElementById('rpassword').value;
            if (fname == '' || uname == '' || pword == '' || rpword == ''){
                document.getElementById('signup_f').style.display = "none";
                $('#myModal').modal('show'); //jquery
                 
            }
            else if (pword !== rpword){
                document.getElementById('signup_f').style.display = "none";
                $('#myModal').modal('show'); //jquery
            }
            else{
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
                            document.getElementById('signup_f').style.display = "none";
                            $('#myModal1').modal('show'); //jquery
                        }
                        else{
                            document.getElementById('signup_f').style.display = "none";
                            $('#myModal').modal('show'); //jquery
                        }
                    }
                    else {
                        console.log('err', req );
                    }
                };
                req.send(JSON.stringify( obj ));
            }
        } );
        

        let login_button = document.getElementById("signin"); //the main sign in button to call the app.js
        login_button.addEventListener('click', function(evt){
            let user = document.getElementById( 'uname1').value;
            let password = document.getElementById('passwrd1').value;
            authenticateUser(user,password,(req)=>{
                if ( req.status == 200 ) { 
                }     
            });   
        });
        
        let button2 = document.getElementById( 'sign-up');
        button2.addEventListener( 'click', (evt) => {
            document.getElementById('signup_f').style.display = "block";
            let button = document.getElementById('up-close');
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
    let obj = {username : user, password : password}
    req.open('POST','/login');
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    
    req.onreadystatechange = function() { 
        if (req.readyState === XMLHttpRequest.DONE){
            if(req.status === 200){
                document.getElementById('body').innerHTML = req.response;
            }
            else if (req.status === 401 || req.status === 403){
                document.getElementById('passerr').innerHTML =`<div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>The username and password you entered did not match our records. 
              Please double-check and try again.</strong> 
              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
              </button>
              </div>`
            }
        } 
    };
    req.send( JSON.stringify( obj ));  
};

class HomePage extends HTMLElement {
    constructor() {
        super();  // is always required
        const thisForm = this;

        let req = new XMLHttpRequest();
        req.open('PUT','/is-checked');
        req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        req.responseType = 'json'; 
        req.onload = function(evt) {
            if ( req.status === 200 ) { // check for ok response
                if (!req.response.status){
                    document.getElementById('first').style.display = "block";
                    let button1 = document.getElementById('next1');
                    var checked;
                    button1.addEventListener('click', function(evt){
                        document.getElementById('first').style.display = "none";
                        document.getElementById('tips_2').style.display = "block";
                        let tipsb = document.getElementById('tips-close');
                        tipsb.addEventListener('click', function(evt){
                            checked = document.getElementById("donots").checked;
                            let obj = {bool:checked}
                            let req = new XMLHttpRequest();
                            req.open('PUT','/update-checked');
                            req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
                            req.responseType = 'json'; 
                            req.onload = function(evt) {
                                if ( req.status == 200 ) { // check for ok response
                                }
                            };
                            req.send(JSON.stringify( obj ));
                            document.getElementById('tips_2').style.display = "none";
                        });
                    });                    
                }
            }
        };
        req.send();

        let button2 = document.getElementById('editp')
        button2.addEventListener('click', function(evt){
            document.getElementById('edit_p').style.display = "block";
            let closeb = document.getElementById('sign-in-close');
            closeb.addEventListener('click', function(evt){
                document.getElementById('edit_p').style.display = "none";
                document.getElementById('error').style.display = "none";
            });
        })

        let logb = document.getElementById( 'logoutb');
        logb.addEventListener( 'click', (evt) => {
            let req = new XMLHttpRequest();
            req.open('POST','/logout');
            req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            
            req.onload = function(evt) {
                if ( req.status == 200 ) { // check for ok response
                    document.getElementById('body').innerHTML = req.response;
                }
                else {
                    console.log('err', req );
                }
            };
            req.send();
        } );

        let editpb = document.getElementById('editp_');
        editpb.addEventListener( 'click', function(evt){
            let opass = document.getElementById( 'opass').value;
            let npass = document.getElementById( 'npass').value;
            let npass1 = document.getElementById( 'npass1').value;
            if (opass == '' || npass == '' || npass1 == ''){
                document.getElementById('errorpass').innerHTML =`<div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>There was an error with changing your password. Try again!</strong> 
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
                </div>`
            }
            else if (npass !== npass1){
                document.getElementById('errorpass').innerHTML =`<div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>There was an error with changing your password. Try again!</strong> 
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
                </div>`
            }
            else{
                let obj = {oldp:opass, newp:npass};
                let req = new XMLHttpRequest();
                req.open('PUT','/update-p');
                req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
                req.responseType = 'json'; 
                req.onload = function(evt) {
                    if ( req.status == 200 ) { // check for ok response
                        let res = req.response;
                        if (res.status !== 'updated'){
                            document.getElementById('errorpass').innerHTML =`<div class="alert alert-danger alert-dismissible fade show" role="alert">
                            <strong>There was an error with changing your password. Try again!</strong> 
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                            </div>`
                        }
                        else{
                            document.getElementById('edit_p').style.display = "none";
                            $('#myModal2').modal('show'); 
                        }
                    }
                    else {
                        console.log('err', req );
                    }
                };
                req.send(JSON.stringify( obj ));
            }
        });

        let requ = new XMLHttpRequest();
        requ.open('PUT','/get-leaderboard');
        requ.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        requ.responseType = 'json'; 
        requ.onload = function(evt) {
            if ( requ.status === 200 ) { // check for ok response
                let results = requ.response.result;
                let size = Object.keys(results).length;
                if (size > 0){
                    let but1 = document.getElementById(results[0].username);
                    but1.addEventListener('click', function(evt){
                        noteUser(results[0].username,(req)=>{ });  
                    });
                }
                if (size > 1){
                    let but1 = document.getElementById(results[1].username);
                    but1.addEventListener('click', function(evt){
                        noteUser(results[1].username,(req)=>{ });  
                    });
                }
                if (size > 2){
                    let but1 = document.getElementById(results[2].username);
                    but1.addEventListener('click', function(evt){
                        noteUser(results[2].username,(req)=>{ });  
                    });
                }
                if (size > 3){
                    let but1 = document.getElementById(results[3].username);
                    but1.addEventListener('click', function(evt){
                        noteUser(results[3].username,(req)=>{ });  
                    });
                }
                if (size > 4){
                    let but1 = document.getElementById(results[4].username);
                    but1.addEventListener('click', function(evt){
                        noteUser(results[4].username,(req)=>{ });  
                    });
                }
            }
        };
        requ.send();


    }
}
function noteUser(user,callback){

    let obj = {user:user};
    let req = new XMLHttpRequest();
    req.open('PUT','/update-not');
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.responseType = 'json'; 
    req.onload = function(evt) {
        if ( req.status == 200 ) { // check for ok response
            let res = req.response;
            if (res.status == 'notupdated'){
                $('#myModal4').modal('show'); //jquery
                console.log('not updated')
            }
            else if (res.status == 'alreadyexists'){
                $('#myModal5').modal('show'); 
            }
            else{
                $('#myModal3').modal('show'); //jquery
            }
        }
        else {
            console.log('err', req );
        }
    };
    req.send(JSON.stringify( obj )); 
};

customElements.define('home-page', HomePage);
customElements.define('initial-page', InitialPage);
customElements.define('game-page', GamePage);
