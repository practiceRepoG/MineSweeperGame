//Each cell structure in grid
class CellState {
    constructor(cellXPos, cellYPos, cellPos) {
        this.cellPos = cellPos;
        this.cellXPos = cellXPos;
        this.cellYPos = cellYPos;
        this.cellVal = "clear";
        this.cellClicked = false;
        this.cellBmbCount = 0;
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
    for (let i = 0; i < bombCount; i++) {
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
            str += `<th id="${i}-${myGrid[j].cellYPos}-${k}" style="height:100px;width:100px"></th>`;
            j++;
            k++;
        }
        str += "</tr>";
        i++;
        j = 0;
    }
    document.getElementById("gridBox").innerHTML = str;
}

//To check adjacent cell
const adj = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
let tmpAdj = [], nextPos;

function cellClicked(e) {
    nextPos = [];
    let idInfo = e.target.id.toString().split("-");
    console.log(myGrid[idInfo[2]]);
    if (myGrid[idInfo[2]].cellVal !== "bomb" && myGrid[idInfo[2]].cellClicked !== true) {
        document.getElementById(e.target.id).style.background = "green";
        myGrid[idInfo[2]].cellClicked = true;
        checkAdjCells(idInfo[2]);
    }
    else if (myGrid[idInfo[2]].cellVal === "bomb") {
        document.getElementById("gridBox").innerHTML = "<h2>You Lost..!!</h2>";
        document.getElementById("startBtn").style.disable = true;
    }
    else if(myGrid[idInfo[2]].cellClicked === true){
        document.getElementById(`${myGrid[idInfo[2]].cellXPos}-${myGrid[idInfo[2]].cellYPos}-${idInfo[2]}`).style.background = "green";
    }
}

function checkAdjCells(pos) {
    let cellXPos = myGrid[pos].cellXPos;
    let cellYPos = myGrid[pos].cellYPos;
    let tmpX, tmpY;
    console.log(cellXPos + adj[0][0]);
    for (let i = 0; i < adj.length; i++) {
        tmpX = cellXPos + adj[i][0];
        tmpY = cellYPos + adj[i][1];
        if (tmpX < gridColBkp && tmpX >= 0 && tmpY < gridColBkp && tmpY >= 0)
            tmpAdj.push([tmpX, tmpY]);
    }
    countTheBomb(tmpAdj, pos);
}

function countTheBomb(tmpAdjs, pos) {
    let count = 0;
    for (let i = 0; i < myGrid.length; i++) {
        for (let j = 0; j < tmpAdjs.length; j++) {
            if (myGrid[i].cellXPos === tmpAdjs[j][0] && myGrid[i].cellYPos === tmpAdjs[j][1]) {
                if (myGrid[i].cellVal === "bomb")
                    count++;
                if (myGrid[i].cellClicked !== true && myGrid[i].cellBmbCount === 0 && count === 0)
                    nextPos.push(i);
                if (myGrid[i].cellClicked === true) {
                    document.getElementById(`${myGrid[i].cellXPos}-${myGrid[i].cellYPos}-${i}`).style.background = "green";
                    if (myGrid[i].cellBmbCount > 0)
                        document.getElementById(`${myGrid[i].cellXPos}-${myGrid[i].cellYPos}-${i}`).innerText = myGrid[i].cellBmbCount.toString();
                }
            }
        }
    }
    if (count > 0) {
        tmpAdj = [];
        myGrid[pos].cellBmbCount = count;
        document.getElementById(`${myGrid[pos].cellXPos}-${myGrid[pos].cellYPos}-${pos}`).style.background = "green";
        document.getElementById(`${myGrid[pos].cellXPos}-${myGrid[pos].cellYPos}-${pos}`).innerText = count.toString();
        return;
    }
    else {
        nextPos = [...new Set(nextPos)];
        while (nextPos.length) {
            tmpAdj = [];
            let p = nextPos.shift();
            if (myGrid[p].cellClicked !== true) {
                myGrid[p].cellClicked = true;
                checkAdjCells(p);
            }
        }
    }
}
