(function()
{
let deleteButton = document.getElementById("deleteUser");
        let tableArea = document.getElementById("UserTable");
        let fSort = document.getElementById("fname-sort");
        let uSort = document.getElementById("uname-sort");
        let id_Sort = document.getElementById("id-sort");
        let scoreSort = document.getElementById("score-sort");
        let del_note = document.getElementById("deleteNotif");
        let del_score = document.getElementById("deleteScore");
        fSort.addEventListener('click',(evt)=>{
            fnameSort(tableArea.lastChild);
        });
        uSort.addEventListener('click',(evt)=>{
            unameSort(tableArea.lastChild);
        });
        id_Sort.addEventListener('click',(evt)=>{
            idSort(tableArea.lastChild);
        });
        scoreSort.addEventListener('click',(evt)=>{
            gwSort(tableArea.lastChild);
        });
        
    tableArea.addEventListener('click',(evt)=>{
        let target = evt.target;
            const nodeName = target.nodeName;
            let p =target.parentNode.nodeName;
            let name = target.getAttribute('name');
            let fname = target.getAttribute('name');
            
            
            if ( target === tableArea ) {
                isSelected( null );
            }
            if(nodeName == "TD" && (name == "user" || fname == "firstname")){
               isSelected(target);
              
            deleteButton.addEventListener('click',(evt)=>{
                let noButton = document.getElementById("noB-del");
                let yesButton = document.getElementById("yesB-del");
                if(theSelected){
                    document.getElementById("d-user").innerHTML = theSelected.innerHTML;
                    document.getElementById("dUser").style.display="block"
                    yesButton.addEventListener('click',(evt)=>{
                        document.getElementById("dUser").style.display="none";
                        if(theSelected){
                        let useId = theSelected.parentNode.getAttribute('id')
                        deleteUser(theSelected.parentNode,useId);
                        theSelected.setAttribute('class','')
                        theSelected=null;
                        }
                        })
                    
                    noButton.addEventListener('click',(evt)=>{
                        if(theSelected){
                        document.getElementById("dUser").style.display="none"
                        theSelected.setAttribute('class','')
                        //isSelected(null)
                        theSelected = null;
                        }
                    })
                }
            })
           
            del_note.addEventListener('click',(evt)=>{
                if(theSelected){
                let useId = theSelected.parentNode.getAttribute('id')
                let uSpan = document.getElementById("note-u");
                let uName = theSelected.innerHTML;
                deleteNotification(useId,uSpan,uName);
                theSelected.setAttribute('class','')
                theSelected = null;
                }
            })
            del_score.addEventListener('click',(evt)=>{
                if(theSelected){
                let useId = theSelected.parentNode.getAttribute('id')
                deleteScore(useId,theSelected.parentNode);
                theSelected.setAttribute('class','')
                theSelected = null;
                }   
            })
        
            }
        })   
    
    
function fnameSort(table){
    let req = new XMLHttpRequest();
    req.open('GET','/fnameSort');
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.responseType = 'json';
    req.onload = function(evt){
        if ( req.status == 200 ) { // check for ok response
            const resp = req.response;
            let list = table.childNodes;
            let x = 0;
            for(var i = 1 ; i< list.length;i +=2){
                let y = 0;
                list[i].setAttribute('id',resp[x].id);
                let data = list[i].childNodes
                let values = Object.values(resp[x]);
                for(var j = 1; j<data.length ;j +=2 ){
                    data[j].innerHTML = values[y];
                    y++;
                }
                x++;
            }  
        }
        else {
            console.log('err', req );
            }
        };
        req.send();
}
function unameSort(table){
    let req = new XMLHttpRequest();
    req.open('GET','/unameSort');
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.responseType = 'json';
    req.onload = function(evt){
        if ( req.status == 200 ) { // check for ok response
            const resp = req.response;
            let list = table.childNodes;
            let x = 0;
            for(var i = 1 ; i< list.length;i +=2){
                let y = 0;
                list[i].setAttribute('id',resp[x].id);
                let data = list[i].childNodes
                let values = Object.values(resp[x]);
                for(var j = 1; j<data.length ;j +=2 ){
                    data[j].innerHTML = values[y];
                    y++;
                }
                x++;
            }  
        }
        else {
            console.log('err', req );
            }
        };
        req.send();
}
function idSort(table){
    let req = new XMLHttpRequest();
    req.open('GET','/idSort');
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.responseType = 'json';
    req.onload = function(evt){
        if ( req.status == 200 ) { // check for ok response
            const resp = req.response;
            let list = table.childNodes;
            let x = 0;
            for(var i = 1 ; i< list.length;i +=2){
                let y = 0;
                list[i].setAttribute('id',resp[x].id);
                let data = list[i].childNodes
                let values = Object.values(resp[x]);
                for(var j = 1; j<data.length ;j +=2 ){
                    data[j].innerHTML = values[y];
                    y++;
                }
                x++;
            }  
        }
        else {
            console.log('err', req );
            }
        };
        req.send();
}
function gwSort(table){
    let req = new XMLHttpRequest();
    req.open('GET','/scoreSort');
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.responseType = 'json';
    req.onload = function(evt){
        if ( req.status == 200 ) { // check for ok response
            const resp = req.response;
            let list = table.childNodes;
            let x = 0;
            for(var i = 1 ; i< list.length;i +=2){
                let y = 0;
                list[i].setAttribute('id',resp[x].id);
                let data = list[i].childNodes
                let values = Object.values(resp[x]);
                for(var j = 1; j<data.length ;j +=2 ){
                    data[j].innerHTML = values[y];
                    y++;
                }
                x++;
            }  
        }
        else {
            console.log('err', req );
            }
        };
        req.send();
}
let theSelected = null;
function isSelected(user){
    if(theSelected && theSelected != null){
        theSelected.classList.remove('highlight'); 
    }
    theSelected = user;
    if ( user && user != null) {
    theSelected.classList.add('highlight');
    }
}

function deleteNotification(id,userSpan,userName){
    let req = new XMLHttpRequest();
    req.open('PUT',`/delete-notification`);
    let obj = {id:id};
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.responseType = 'json'; 
    req.onload = function(evt) {
        if ( req.status == 200 ) { // check for ok response
            const resp = req.response; 
            if(resp.status === "updated"){
            userSpan.innerHTML = userName;
            $('#note-del').modal('show');

            }
        }
        else {
            console.log('err', req );
        }
}
    req.send(JSON.stringify(obj))
}
function deleteScore(id,userRow){
    let obj = {id:id};
    let score = userRow.querySelector("td[name='gamesWon']")
    let req = new XMLHttpRequest();
    req.open('PUT','/delete-score');
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.responseType = 'json';
    req.onload = function(evt) {
        if ( req.status == 200 ) {
            const resp = req.response; 
            if(resp.status === "updated"){
            score.innerHTML = 0;
        }
    }
        else {
            console.log('err', req );
        }
    }

    req.send(JSON.stringify(obj));
}
function deleteUser( userRow, id ) {
    let req = new XMLHttpRequest();
    let obj = {id: id};
    req.open('DELETE', `/deleteUser`);
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    req.responseType = 'json';
    req.onload = function(evt) {
    
        if ( req.status == 200 ) { // check for ok response
            const resp = req.response;
            if(resp.status ==='deleted'){ 
            userRow.remove();
            }
        else {
            console.log('err', req );
            }
        };
    }
    req.send(JSON.stringify(obj));

}

}())