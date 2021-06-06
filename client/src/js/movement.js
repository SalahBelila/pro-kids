var global = {
    rowsNum: 15,
    colsNum: 15,
    currentPosition: undefined, // range = [0, rowsNum*colsNum - 1]
    currentDirection: undefined, //possible values: front, left, right, back
    timeoutDelay: 500,
    movements: [],
    directions: [],
    roadMap: [],
    workspace: undefined, //blockly workspace
}

function init (initialPosition, initialDirection, roadMap = []) {

    let squaresTable = document.createElement('table');
    squaresTable.cellSpacing = "0";
    let tbody = document.createElement('tbody');
    
    for (let i = 0; i < global.rowsNum; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < global.colsNum; j++) {
            let td = document.createElement('td');
            td.className = 'square';
            td.id = i * global.colsNum + j;
            let div = document.createElement('div');
            if (td.id === roadMap[roadMap.length - 1]) {
                let lastSquare = document.createElement('div');
                div.appendChild(lastSquare);
            }
            td.appendChild(div);
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    squaresTable.appendChild(tbody);
    document.getElementById('map-panel').appendChild(squaresTable);
    
    // Make the road map.
    for (id of roadMap) {
        roadSquare = document.getElementById(id);
        roadSquare.className = roadSquare.className + ' road-square';
    }

    lastSquare = document.getElementById(roadMap[roadMap.length - 1]);
    lastSquare.className = lastSquare.className + ' last-square';
    
    global.currentPosition = initialPosition;
    global.currentDirection = initialDirection;
    global.roadMap = roadMap;

    moveToSquare(global.currentPosition);

    global.workspace = Blockly.inject('blockly-panel', {
        toolbox: document.getElementById('toolbox')
    });
}

function moveToSquare (id) {

    if (id < 0 || id >= global.rowsNum * global.colsNum) {
        throw Error("Game character out of bounds.");
    }

    let oldSquare = document.getElementById(global.currentPosition);
    if (global.roadMap.includes(global.currentPosition)){
        oldSquare.className = 'square road-square';
    } else {
        oldSquare.className = 'square';
    }

    let selectedSquare = document.getElementById(id);
    if (global.roadMap.includes(id)) {
        selectedSquare.className = 'square selected-road-square';
    } else {
        selectedSquare.className = 'square selected-square';
    }

    global.currentPosition = id;
}

function turnLeft () {
    if (global.currentDirection === 'right') {
        global.currentDirection = 'front';
    } else if (global.currentDirection === 'left') {
        global.currentDirection = 'back';
    } else if (global.currentDirection === 'front') {
        global.currentDirection = 'left';
    } else if (global.currentDirection === 'back') {
        global.currentDirection = 'right';
    }
}

function turnRight () {
    if (global.currentDirection === 'right') {
        global.currentDirection = 'back';
    } else if (global.currentDirection === 'left') {
        global.currentDirection = 'front';
    } else if (global.currentDirection === 'front') {
        global.currentDirection = 'right';
    } else if (global.currentDirection === 'back') {
        global.currentDirection = 'left';
    }
}

async function generateCode () {
    Blockly.JavaScript.addReservedWords('code');
    var code = Blockly.JavaScript.workspaceToCode(global.workspace);
    eval(code);
    console.log(global.movements);
    for (squareId of global.movements) {
        if (global.roadMap.includes(squareId)) {
            moveToSquare(squareId);
            await sleep(global.timeoutDelay);
        } else {
            console.log(global.roadMap, squareId);
            moveToSquare(squareId);
            await sleep(global.timeoutDelay);
            break;
            // throw Error('Character Out of Road Map.');
        }
    }

    if (global.currentPosition === global.roadMap[global.roadMap.length - 1]) {
        document.getElementById('win').style.display = "flex";
        document.getElementById('overlay').style.display = "block";
        return;
    }
    
    document.getElementById('lose').style.display = "flex";
    document.getElementById('overlay').style.display = "block";
}

function stepForward () {
    const id = global.movements[global.movements.length - 1] || global.currentPosition;
    if (id > -1 && id < global.colsNum) {
        // throw Error("Cannot step forward, out of bounds.");
    }
    global.movements.push(id - global.colsNum);
}

function stepBackward () {
    const id = global.movements[global.movements.length - 1] || global.currentPosition;
    if (id > (global.colsNum * global.rowsNum - global.colsNum) && id < (global.colsNum * global.rowsNum)) {
        // throw Error("Cannot step backward, out of bounds.");
    }
    global.movements.push(id + global.colsNum);
}

function stepRight () {
    const id = global.movements[global.movements.length - 1] || global.currentPosition;
    if ((id + 1) % global.colsNum === 0) {
        // throw Error("Cannot step right, out of bounds.");
    }
    global.movements.push(id + 1);
}

function stepLeft () {
    const id = global.movements[global.movements.length - 1] || global.currentPosition;
    if (id % global.colsNum === 0) {
        // throw Error("Cannot step left, out of bounds.");
    }
    global.movements.push(id - 1);
}

async function oneStep () {
    if (global.currentDirection === 'front') {
        stepForward();
        console.log('forward');
    }
    else if (global.currentDirection === 'back') {
        stepBackward();
        console.log('backward');
    }
    else if (global.currentDirection === 'right') {
        stepRight();
        console.log('right');
    }
    else if (global.currentDirection === 'left') {
        stepLeft();
        console.log('left');
    } else {
        throw Error(`Cannot move, invalid direction: ${global.currentDirection}`);
    }
    global.directions.push(global.currentDirection);
}

function sleep(delay){
    return new Promise (function (resolve, _) {
        setTimeout(() => resolve(), delay);
    });
}