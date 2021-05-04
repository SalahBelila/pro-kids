var global = {
    rowsNum: 10,
    colsNum: 15,
    currentPosition: undefined,
    currentDirection: undefined,
    timeoutDelay: 500,
    movements: [],
}

var movementMap = {
    "block-left": () => turn('left'),
    "block-right": () => turn('right'),
    "block-forward": () => move(),
}

function init (initialPosition, initialDirection, blocksList) {

    loadBlocks(blocksList);
    
    let squaresTable = document.createElement('table');
    let tbody = document.createElement('tbody');
    
    for (let i = 0; i < global.rowsNum; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < global.colsNum; j++) {
            let td = document.createElement('td');
            td.className = 'square';
            td.id = i * global.colsNum + j;
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    squaresTable.appendChild(tbody);
    document.getElementById('game-panel').appendChild(squaresTable);
    
    global.currentPosition = initialPosition;
    turn(initialDirection);
    
    moveSelectedSquare(global.currentPosition);
}

function loadBlocks (blocksList) {

    let elementsPanel = document.getElementById('elements-panel');

    for (blockName of blocksList) {
        fetch(`http://localhost:5500/html/blocks/${blockName}.html`)
        .then(data => data.text())
        .then(html => {
            template = document.createElement('template');
            template.innerHTML = html.trim();
            elementsPanel.appendChild(template.content.firstChild);
        });
    }
}

function allowDrop(e) {
    e.preventDefault();
}

function drag(e) {
    e.dataTransfer.setData("text/plain", e.target.id);
}

function drop(e, idPrefix) {
    // e.preventDefault();
    let data = e.dataTransfer.getData("text/plain");
    let clonedElement = document.createElement('div')
    clonedElement.innerHTML = document.getElementById(data).innerHTML;
    clonedElement.id = `${idPrefix ? idPrefix + '-' : ''}blocked-${e.target.childNodes.length}`;
    clonedElement.className = document.getElementById(data).className;
    clonedElement.value = data;
    e.target.appendChild(clonedElement);
}

function moveSelectedSquare (id) {

    if (id < 0 || id > global.rowsNum * global.colsNum) {
        throw Error("Game character out of bounds.");
    }

    let oldSquare = document.getElementById(global.currentPosition);
    oldSquare.style = undefined;
    oldSquare.className = 'square';

    let selectedSquare = document.getElementById(id);
    selectedSquare.className = 'selected-square';
    selectedSquare.style.backgroundImage = `url(../assets/character-${global.currentDirection}.jpg)`;

    global.currentPosition = id;
}

function stepForward () {
    const id = global.currentPosition;
    if (id > -1 && id < global.colsNum) {
        throw Error("Cannot step forward, out of bounds.");
    }
    moveSelectedSquare(id - global.colsNum);
}

function stepBackward () {
    const id = global.currentPosition;
    if (id > (global.colsNum * global.rowsNum - global.colsNum) && id < (global.colsNum * global.rowsNum)) {
        throw Error("Cannot step backward, out of bounds.");
    }
    moveSelectedSquare(id + global.colsNum);
}

function stepRight () {
    const id = global.currentPosition;
    if ((id + 1) % global.colsNum === 0) {
        throw Error("Cannot step right, out of bounds.");
    }
    moveSelectedSquare(id + 1);
}

function stepLeft () {
    const id = global.currentPosition;
    if (id % global.colsNum === 0) {
        throw Error("Cannot step left, out of bounds.");
    }
    moveSelectedSquare(id - 1);
}

function turn (direction) {
    let element = document.getElementById(global.currentPosition);

    if (global.currentDirection === undefined) {
        global.currentDirection = direction;
        element.style.backgroundImage = `url('../assets/character-${direction}.jpg')`
        return;
    }

    if (direction === 'right') {
        if (global.currentDirection === 'forward') {
            global.currentDirection = 'right';
            element.style.backgroundImage = "url('../assets/character-right.jpg')";
        } else if (global.currentDirection === 'backward') {
            global.currentDirection = 'left';
            element.style.backgroundImage = "url('../assets/character-left.jpg')";
        } else if (global.currentDirection === 'right') {
            global.currentDirection = 'backward';
            element.style.backgroundImage = "url('../assets/character-backward.jpg')";
        } else if (global.currentDirection === 'left') {
            global.currentDirection = 'forward';
            element.style.backgroundImage = "url('../assets/character-forward.jpg')";
        }

    } else if (direction === 'left') {
        if (global.currentDirection === 'forward') {
            global.currentDirection = 'left';
            element.style.backgroundImage = "url('../assets/character-left.jpg')";
        } else if (global.currentDirection === 'backward') {
            global.currentDirection = 'right';
            element.style.backgroundImage = "url('../assets/character-right.jpg')";
        } else if (global.currentDirection === 'right') {
            global.currentDirection = 'forward';
            element.style.backgroundImage = "url('../assets/character-forward.jpg')";
        } else if (global.currentDirection === 'left') {
            global.currentDirection = 'backward';
            element.style.backgroundImage = "url('../assets/character-backward.jpg')";
        }

    } else {
        throw Error("Cannot turn, invalid direction.");
    }
}

function move () {
    if (global.currentDirection === 'forward') {
        stepForward();
    }
    else if (global.currentDirection === 'backward') {
        stepBackward();
    }
    else if (global.currentDirection === 'right') {
        stepRight();
    }
    else if (global.currentDirection === 'left') {
        stepLeft();
    } else {
        throw Error("Cannot move, invalid direction.");
    }
}

async function startMovement(e) {

    let elements = document.getElementById('blocked-panel').childNodes;

    if (elements.length === 0) {
        return 0;
    }

    let actions = parser(elements);
    for (action of actions) {
        console.log(action);
        movementMap[action] ? movementMap[action]() : undefined;
        await sleep(global.timeoutDelay);
    }

}

function sleep (delay) {
    return new Promise (function (resolve, _) {
        setTimeout(() => resolve(), delay);
    });
}

function parser (elements) {
    let actions = [];

    for (element of elements) {
        console.log(element);
        if (element.value == 'block-for') {
            let forElements = element.childNodes;
            for (let i = element.childNodes[2].value; i > 0; i--) {
                for (forElement of forElements) {
                    actions.push(forElement.value);
                }
            }
        } else {
            console.log(element.value);
            actions.push(element.value);
        }
    }

    return actions;
}
