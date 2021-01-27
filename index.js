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

let gameRules = `<h2>GAME RULES</h2><br>
                 <h4>*Grid rows and coloumn should be >3 and <=10</h4><br>`;

//Global var for refrence
let myGrid, gridRowBkp = 0, gridColBkp = 0;

//Initialise grid with given rowsa and coloumn
function initialiseGrid() {
    let gridRow = document.getElementById("rowInput").value;
    gridRowBkp = Number(gridRow);
    let gridCol = document.getElementById("colInput").value;
    gridColBkp = Number(gridCol);
    let bombCount = gridRowBkp;
    if(gridRowBkp>3 && gridRowBkp<=10 && gridColBkp>3 && gridColBkp<=10){
        let tmpGrid = [];
        let pos = 0;
        for (let x = 0; x < gridRow; x++) {
            for (let y = 0; y < gridCol; y++) {
                tmpGrid.push(new CellState(x, y, pos));
                pos++;
            }
        }
        myGrid = tmpGrid;
        assignBombRandomly(bombCount)
    }
    else document.getElementById("gridBox").innerHTML = gameRules;
}

//Assigning boms randomly as per user input
function assignBombRandomly(bombCount) {
    let randomeCell;
    let forRandom = (gridColBkp*gridRowBkp)-1;
    for (let i = 0; i < bombCount; i++) {
        randomeCell = Math.floor(Math.random() * forRandom);
        if(myGrid[randomeCell].cellVal==="clear")
            myGrid[randomeCell].cellVal = "bomb";
        else i--;
    }
    console.log(myGrid);
    document.getElementById("infoP").innerText = `*Number of bombs will be ${bombCount}`;
    updateDiv();
}

//Construct and Assign grid to container
function updateDiv() {
    let str = "<table border='1'class='tableProp' onClick='cellClicked(event)'>", i = 0, j = 0, k = 0;
    while (i < gridRowBkp) {
        str += "<tr>";
        while (j < gridColBkp) {
            str += `<th id="${i}-${myGrid[j].cellYPos}-${k}" style="height:50px;width:50px"></th>`;
            j++; k++;
        }
        str += "</tr>";
        i++; j = 0;
    }
    document.getElementById("gridBox").innerHTML = str;
}

//To check adjacent cell of clicked cell
const adj = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
let tmpAdj = [], nextPos;

//cell click event triggered
function cellClicked(e) {
    nextPos = [];
    let idInfo = e.target.id.toString().split("-");
    if (myGrid[idInfo[2]].cellVal !== "bomb" && myGrid[idInfo[2]].cellClicked !== true) {
        document.getElementById(e.target.id).style.background = "rgb(153, 255, 204)";
        myGrid[idInfo[2]].cellClicked = true;
        checkAdjCells(idInfo[2]);
    }
    else if (myGrid[idInfo[2]].cellVal === "bomb") {
        document.getElementById("gridBox").innerHTML = "<h2>You Lost..!!</h2>";
        document.getElementById("startBtn").disabled = true;
    }
    else if(myGrid[idInfo[2]].cellClicked === true){
        document.getElementById(`${myGrid[idInfo[2]].cellXPos}-${myGrid[idInfo[2]].cellYPos}-${idInfo[2]}`).style.background = "rgb(153, 255, 204)";
    }
    checkForWin();
}

//Check next adj cells
function checkAdjCells(pos) {
    let cellXPos = myGrid[pos].cellXPos;
    let cellYPos = myGrid[pos].cellYPos;
    let tmpX, tmpY;
    for (let i = 0; i < adj.length; i++) {
        tmpX = cellXPos + adj[i][0];
        tmpY = cellYPos + adj[i][1];
        if (tmpX < gridColBkp && tmpX >= 0 && tmpY < gridColBkp && tmpY >= 0)//Avoiding invalid cell check
            tmpAdj.push([tmpX, tmpY]);
    }
    countTheBomb(tmpAdj, pos);
}

//Taking bomb count and update
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
                    document.getElementById(`${myGrid[i].cellXPos}-${myGrid[i].cellYPos}-${i}`).style.background = "rgb(153, 255, 204)";
                    if (myGrid[i].cellBmbCount > 0)
                        document.getElementById(`${myGrid[i].cellXPos}-${myGrid[i].cellYPos}-${i}`).innerText = myGrid[i].cellBmbCount.toString();
                }
            }
        }
    }
    if (count > 0) {
        tmpAdj = [];
        myGrid[pos].cellBmbCount = count;
        document.getElementById(`${myGrid[pos].cellXPos}-${myGrid[pos].cellYPos}-${pos}`).style.background = "rgb(153, 255, 204)";
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
                checkAdjCells(p); //recursively calls the function to decide cell needs to be revealed or not
            }
        }
    }
}
//On each click check for win
function checkForWin(){
    let leftOtBox=0;
    for(let i=0; i<myGrid.length; i++){
        if(myGrid[i].cellClicked === false)
            leftOtBox++;
    }
    if(leftOtBox === gridRowBkp){
        document.getElementById("gridBox").innerHTML = "<h2>You Win</h2>";
        document.getElementById("startBtn").disabled = true;
    }
}
