//Each cell structure in grid
class CellState {
    constructor(cellXPos, cellYPos, cellPos) {
        this.cellPos = cellPos;
        this.cellXPos = cellXPos;
        this.cellYPos = cellYPos;
        this.cellVal = "clear";
        this.cellClicked = false;
    }
}

//Global var for refrence
let myGrid, gridRowBkp = 0, gridColBkp = 0;

//Initialise grid with given rowsa and coloumn
function initialiseGrid() {
    let gridRow = document.getElementById("rowInput").value;
    gridRowBkp = gridRow;
    let gridCol = document.getElementById("colInput").value;
    gridColBkp = gridCol;
    let tmpGrid = [];
    let pos = 0;
    for (let x = 0; x < gridRow; x++) {
        for (let y = 0; y < gridCol; y++) {
            tmpGrid.push(new CellState(x, y, pos));
            pos++;
        }
    }
    myGrid = tmpGrid;
    let bombCount = document.getElementById("bomb").value;
    assignBombRandomly(bombCount)
}

//Assigning boms randomly as per user input
function assignBombRandomly(bombCount) {
    let randomeCell;
    for (let i = 0; i <= bombCount; i++) {
        randomeCell = Math.floor(Math.random() * (gridRowBkp * gridRowBkp));
        myGrid[randomeCell].cellVal = "bomb";
    }
    console.log(myGrid);
    updateDiv();
}

//Construct and Assign grid to container
function updateDiv() {
    let str = "<table border='1'class='tableProp' onClick='cellClicked(event)'>", i = 0, j = 0, k = 0;
    while (i < gridRowBkp) {
        str += "<tr>";
        while (j < gridColBkp) {
            str += `<th id="${i}-${myGrid[j].cellYPos}-${k}"></th>`;
            j++;
            k++;
        }
        str += "</tr>";
        i++;
        j = 0;
    }
    document.getElementById("gridBox").innerHTML = str;
}


function cellClicked(e) {
    let idInfo = e.target.id.toString().split("-");
    console.log(myGrid[idInfo[2]]);
    if (myGrid[idInfo[2]].cellVal !== "bomb") {
        document.getElementById(e.target.id).style.background = "green";
        myGrid[idInfo[2]].cellClicked = true;
        document.getElementById(e.target.id).innerText = checkAdjCells(idInfo[2]);
    }
    else {
        document.getElementById(e.target.id).style.background = "red";
        document.getElementById("gridBox").innerHTML = "<h2>You Lost..!!</h2>";
    }
}

//To check adjacent cell
const adj = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

function checkAdjCells(pos) {
    let cellXPos = myGrid[pos].cellXPos;
    let cellYPos = myGrid[pos].cellYPos;
    let tmpAdj = [], tmpX, tmpY;
    console.log(cellXPos + adj[0][0]);
    for (let i = 0; i < adj.length; i++) {
        tmpX = cellXPos + adj[i][0];
        tmpY = cellYPos + adj[i][1];
        tmpAdj.push([tmpX, tmpY]);
    }
   return countTheBomb(tmpAdj);
}

function countTheBomb(tmpAdj){
    let count = 0;
    for(let i=0; i<myGrid.length; i++){
        for(let j=0; j<tmpAdj.length; j++){
            if(myGrid[i].cellXPos === tmpAdj[j][0] && myGrid[i].cellYPos === tmpAdj[j][1] && myGrid[i].cellVal === "bomb"){
                count++;
            }
        }
    }
    return count;
}
