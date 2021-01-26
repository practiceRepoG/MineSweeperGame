//Each cell structure in grid
class CellState {
    constructor(cellXPos, cellYPos) {
        this.cellXPos = cellXPos;
        this.cellYPos = cellYPos;
        this.cellVal = "clear";
        this.cellClicked = false;
    }
}

//Global var for refrence
let myGrid;
let gridRowBkp = 0;
let gridColBkp = 0;

//Initialise grid with given rowsa and coloumn
function initialiseGrid() {
    let gridRow = document.getElementById("rowInput").value;
    gridRowBkp = gridRow;
    let gridCol = document.getElementById("colInput").value;
    gridColBkp = gridCol;
    let tmpGrid = [];
    for (let x = 0; x < gridRow; x++) {
        for (let y = 0; y < gridCol; y++) {
            tmpGrid.push(new CellState(x, y));
        }
    }
    myGrid = tmpGrid;
    let bombCount = document.getElementById("bomb").value;
    assignBombRandomly(bombCount)
}

//Assigning boms randomly as per user input
function assignBombRandomly(bombCount) {
    let randomeCell;
    for (let i = 0; i < bombCount; i++) {
        randomeCell = Math.floor(Math.random() * gridRowBkp);
        myGrid[randomeCell].cellVal = "bomb";
    }
    updateDiv();
}

//Assign grid to container
function updateDiv() {
    let str = "<table border='1'class='tableProp' onClick='logCell(event)'>", i = 0, j = 0;
    while (i < gridRowBkp) {
        str += "<tr>";
        while (j < gridColBkp) {
            str += `<th id="${i}-${myGrid[j].cellYPos}"></th>`;
            j++;
        }
        str += "</tr>";
        i++;
        j = 0;
    }
    document.getElementById("gridBox").innerHTML = str;
}

function logCell(e){
    console.log(e.target);
    document.getElementById(e.target.id).style.background = "green";
}
//To check adjacent cell
const adj = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];