const editor = document.getElementById('editor');
let score = 0;
editor.addEventListener('mousedown',function(evt){
    evt.preventDefault();
    // selected element given by target
    const target = evt.target;
    const node_name = target.nodeName;
    // only drag a use element
    if ( node_name !== "use" ) return;
    // delta between mouse and use group center
    let dx = parseFloat( target.getAttribute('x') );
    let dy = parseFloat( target.getAttribute('y') )
    let ppos = [dx, dy];

    let delta = editor.createSVGPoint();
    // coordinates of mouse
    delta.x = evt.clientX;
    delta.y = evt.clientY;
    const ctm = target.getScreenCTM();
    const inv_ctm = ctm.inverse();
    delta = delta.matrixTransform(inv_ctm);
    // transformed into svg coordinates
    dx -= delta.x;
    dy -= delta.y;
    // closure to drag target
    function dragging(evt){
        let pt = editor.createSVGPoint();
        pt.x = evt.clientX;
        pt.y = evt.clientY;
        svgP = pt.matrixTransform(inv_ctm);
        svgP.x += dx;
        svgP.y += dy;
        target.setAttribute('x', svgP.x);
        target.setAttribute('y', svgP.y);
    }
    editor.addEventListener('mousemove', dragging);
    // cancel drag on mouseup, mouse is removed after firing
    editor.addEventListener('mouseup', function(evt){
        editor.removeEventListener('mousemove',dragging);
        dx = parseFloat( target.getAttribute('x') );
        dy = parseFloat( target.getAttribute('y') );
        if(dx >= -15 && dx < 210 && dy > 35 && dy < 160){
            let elem = document.getElementById('a1')
            console.log(elem.getAttribute('x'));
            let country = target.getAttribute('wid');
            if (country == "Canada"){
                target.parentNode.removeChild(target);
                elem.parentNode.removeChild(elem);
                score ++;
                let texta = document.getElementById('score');
                texta.value = "Score: " + score;
            }
            else{
                target.setAttribute('x', ppos[0]);
                target.setAttribute('y', ppos[1]);
            }
        }
        else if(dx >= 225 && dx < 450 && dy > 35 && dy < 160){
            let elem = document.getElementById('a2')
            let country = target.getAttribute('wid');
            if (country == "Nigeria"){
                target.parentNode.removeChild(target);
                elem.parentNode.removeChild(elem);
                score ++;
                let texta = document.getElementById('score');
                texta.value = "Score: " + score;
            }
            else{
                target.setAttribute('x', ppos[0]);
                target.setAttribute('y', ppos[1]);
            }

        }
        else if(dx >= 475 && dx < 700 && dy > 18 && dy < 160){
            let elem = document.getElementById('a3')
            let country = target.getAttribute('wid');
            if (country == "Saudi"){
                target.parentNode.removeChild(target);
                elem.parentNode.removeChild(elem);
                score ++;
                let texta = document.getElementById('score');
                texta.value = "Score: " + score;
            }
            else{
                target.setAttribute('x', ppos[0]);
                target.setAttribute('y', ppos[1]);
            }
        }
        else if(dx >= -15 && dx < 210 && dy > 179 && dy < 320){
            let elem = document.getElementById('a4')
            let country = target.getAttribute('wid');
            if (country == "Somalia"){
                target.parentNode.removeChild(target);
                elem.parentNode.removeChild(elem);
                score ++;
                let texta = document.getElementById('score');
                texta.value = "Score: " + score;
            }
            else{
                target.setAttribute('x', ppos[0]);
                target.setAttribute('y', ppos[1]);
            }
        }
        else if(dx >= 225 && dx < 450 && dy > 179 && dy < 320){
            let elem = document.getElementById('a5')
            let country = target.getAttribute('wid');
            if (country == "USA"){
                target.parentNode.removeChild(target);
                elem.parentNode.removeChild(elem);
                score ++;
                let texta = document.getElementById('score');
                texta.value = "Score: " + score;
            }
            else{
                target.setAttribute('x', ppos[0]);
                target.setAttribute('y', ppos[1]);
            }

        }
        else if(dx >= 475 && dx < 700 && dy > 179 && dy < 320){
            let elem = document.getElementById('a6')
            let country = target.getAttribute('wid');
            if (country == "Zimbabwe"){
                target.parentNode.removeChild(target);
                elem.parentNode.removeChild(elem);
                score ++;
                let texta = document.getElementById('score');
                texta.value = "Score: " + score;
            }
            else{
                target.setAttribute('x', ppos[0]);
                target.setAttribute('y', ppos[1]);
            }
        }
        else{
            target.setAttribute('x', ppos[0]);
            target.setAttribute('y', ppos[1]);
        }
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
    }, {once : true});
});