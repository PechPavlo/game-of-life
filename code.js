'use strict';

let rows = 60;
let cols = 100;
let playing = false;
let randomNum ;

let grid = [];
let nextGrid = [];

let timer;
let reproductionTime = 80;


function initializeGrid(){
    for (let i = 0; i < rows; i++) {
        grid[i] = [];
        nextGrid[i] = [];
    }
}
function resetGrids(){
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }
}

function copyAndResetGrid(){
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}

function initialize() {
    initializeGrid();
    resetGrids();
    createTable();
    setupControlButtons();
  };

  function createTable() {
    let ourtable = document.createElement("table");
    let gridContainer = document.querySelector("#grid-container");
    for (let i = 0; i < rows; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement('td');
            cell.setAttribute("id", `${i}_${j}`);
            cell.setAttribute("class","dead");
            cell.addEventListener('click',cellClickHandler);
            tr.appendChild(cell);
        }
        ourtable.appendChild(tr);
    }
    gridContainer.appendChild(ourtable);
}

function cellClickHandler(){
    let rowcol = this.id.split("_");
    let row = rowcol[0];
    let col = rowcol[1];
    let classes = this.getAttribute("class");
    if (classes.indexOf("live")> -1) {
        this.setAttribute("class","dead");
        grid[row][col] = 0;
    } else {
        this.setAttribute("class","live");
        grid[row][col] = 1;
    }
}

function updateView(){
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.getElementById(`${i}_${j}`);
            if (grid[i][j] == 0) {
                cell.setAttribute("class","dead");
            } else {
                cell.setAttribute("class","live");
            }
        }
    }
}
function setupControlButtons() {
    let startButton = document.querySelector("#start");
    startButton.addEventListener("click", startButtonHandler);

    let cleartButton = document.querySelector("#clear");
    cleartButton.addEventListener("click",clearButtonHandler);

    let randomButton = document.querySelector('#random');
    randomButton.addEventListener('click', randomButtonHandler)
}

function clearButtonHandler() {
    playing = false;
    let startButton = document.querySelector("#start");
    startButton.innerHTML = "start";
    clearTimeout(timer);
    let cellList = document.querySelectorAll('.live');
    cellList.forEach(el => {
        el.setAttribute('class', 'dead');
    });
    resetGrids()
}
function startButtonHandler() {
    if (playing) {
        playing = false;
        this.innerHTML = "continue";
        clearTimeout(timer);
    }else{
        playing = true;
        this.innerHTML ="pause";
        play();
    }
}

function randomButtonHandler() {
    if(playing) return;
    clearButtonHandler()
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.getElementById(`${i}_${j}`);
            randomNum = Math.round(Math.random());
            if (randomNum == 1) {
                cell.setAttribute("class","live");
                grid[i][j] = 1;
            }
        }
    }
}
function play() {
    computeNextGen();

    if (playing) {
        timer = setTimeout(play, reproductionTime);
    }
}
function computeNextGen() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            applyRules(i, j);
        }
    }
    copyAndResetGrid();
    updateView();
}

// RULES
// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overcrowding.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
function applyRules(row, col) {
    let numNeighborgs = countNeighborgs (row, col);
   if (grid[row][col] == 1) {
       if (numNeighborgs < 2) {
           nextGrid[row][col] = 0;
       } else {if (numNeighborgs ==2 || numNeighborgs == 3) {
        nextGrid[row][col] = 1;
       } else {if(numNeighborgs > 3)
        nextGrid[row][col] = 0;
            }
        }
   } else {if(grid[row][col] == 0){
       if(numNeighborgs == 3){nextGrid[row][col] = 1;}}
            }
}
function countNeighborgs(row, col) {
    let count = 0;
    if (row-1 >= 0) {
        if (grid[row-1][col] == 1) count++;
    }
    if (row-1 >= 0 && col-1 >= 0) {
        if (grid[row-1][col-1] == 1) count++;
    }
    if (row-1 >= 0 && col+1 < cols) {
        if (grid[row-1][col+1] == 1) count++;
    }
    if (col-1 >= 0) {
        if (grid[row][col-1] == 1) count++;
    }
    if (col+1 < cols) {
        if (grid[row][col+1] == 1) count++;
    }
    if (row+1 < rows) {
        if (grid[row+1][col] == 1) count++;
    }
    if (row+1 < rows && col-1 >= 0) {
        if (grid[row+1][col-1] == 1) count++;
    }
    if (row+1 < rows && col+1 < cols) {
        if (grid[row+1][col+1] == 1) count++;
    }
    return count;
}
window.onload = initialize();
