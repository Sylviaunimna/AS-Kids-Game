class DragAndDrop extends HTMLElement {
    constructor(){
        super();
        const thisForm = this;
           
    } 

}
let newButton = document.getElementById("new");
let endButton = document.getElementById("end");

endButton.addEventListener('click',(evt)=>{
    let score = endGame();

    if (score == 12){
        let req = new XMLHttpRequest();
        
    }
})

  
function endGame(){
let score = 0;
if(document.querySelector("use[href='#1']") && document.querySelector("use[href='#1']").getAttribute("position") =="1"){
    score++;
}
if(document.querySelector("use[href='#2']") && document.querySelector("use[href='#2']").getAttribute("position") =="2"){
    score++;
}
if(document.querySelector("use[href='#3]'") && document.querySelector("use[href='#3']").getAttribute("position") =="3"){
    score++;
}
if(document.querySelector("use[href='#4']") && document.querySelector("use[href='#4']").getAttribute("position") =="4"){
    score++;
}
if(document.querySelector("use[href='#5']") && document.querySelector("use[href='#5']").getAttribute("position") =="5"){
    score++;
}
if(document.querySelector("use[href='#6']") && document.querySelector("use[href='#6']").getAttribute("position") =="6"){
    score++;
}

if(document.querySelector("use[href='#7']") && document.querySelector("use[href='#7']").getAttribute("position") =="7"){
    score++;
}
if(document.querySelector("use[href='#8']") && document.querySelector("use[href='#8']").getAttribute("position") =="8"){
    score++;
}
if(document.querySelector("use[href='#9']") && document.querySelector("use[href='#9']").getAttribute("position") =="9"){
    score++;
}
if(document.querySelector("use[href='#10']") && document.querySelector("use[href='#10']").getAttribute("position") =="10"){
    score++;
}
if(document.querySelector("use[href='#11']") && document.querySelector("use[href='#11']").getAttribute("position") =="11"){
    score++;
}
if(document.querySelector("use[href='#12']") && document.querySelector("use[href='#12']").getAttribute("position") =="12"){
    score++;
}
console.log(score)
return score
}
function swapTiles(tile1,tile2,direction){
    let temp_x = tile1.getAttribute("x");
    let temp_y = parseInt(tile1.getAttribute("y"))
    let temp_row = tile1.getAttribute("row");
    let temp_col = tile1.getAttribute("column");
    let temp_pos = tile1.getAttribute('position');

    tile1.setAttribute('position', tile2.getAttribute('position'))
    tile1.setAttribute("x",tile2.getAttribute("x"));
    tile1.setAttribute("row",tile2.getAttribute("row"))
    tile1.setAttribute("column",tile2.getAttribute("column"));
    tile2.setAttribute("x",temp_x);
    tile2.setAttribute("row",temp_row);
    tile2.setAttribute("column",temp_col);
    tile2.setAttribute('position',temp_pos)

    if(direction == "up"){
        // We are adding adding the height of the svg to the tile and subracting it from the empty tile for 
        //it to switch.
        let y = parseInt(tile1.getAttribute("y")) - 33;
        tile1.setAttribute("y",y)//.getAttribute("y"));
        tile2.setAttribute("y",parseInt(tile2.getAttribute("y"))+33);   
    }
    if(direction == "down"){
        // We are adding the height of the svg to the empty tile and subracting it from the tile for 
        //it to switch. 
        let y = parseInt(tile1.getAttribute("y")) + 33 
        tile1.setAttribute("y",y)
        tile2.setAttribute("y",parseInt(tile2.getAttribute("y"))-33);
    } 
}
function clickTile(tile)
{
    let tile_row= tile.getAttribute("row");
    let tile_col = tile.getAttribute("column");
    let emptyTile_id = "#12";
    let emptyTile = document.querySelector("use[href='#12']");
    let etile_row = emptyTile.getAttribute("row");
    let etile_col =  emptyTile.getAttribute("column");
    if(tile.getAttribute("href")!= emptyTile_id){
        if(tile_col < 4){
            if(etile_col == parseInt(tile_col) + 1 && etile_row == tile_row){
                swapTiles(tile,emptyTile,"right");
            }
        }
        if(tile_row > 1 ){
            if(etile_row == parseInt(tile_row) - 1 && etile_col == tile_col){
                swapTiles(tile,emptyTile,"up");
            }
        }
        if(tile_col > 1){
           if(etile_col == parseInt(tile_col) - 1 && etile_row ==tile_row){
               swapTiles(tile,emptyTile,"left");
           }
        }
    if(tile_row < 3){
        if(etile_row == parseInt(tile_row)+1 && tile_col == etile_col){
            swapTiles(tile,emptyTile,"down");
            }
        }
    }
}

customElements.define('drag-drop', DragAndDrop);