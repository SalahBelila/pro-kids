var global = {
    rowsNum: 15,
    colsNum: 15,
    currentPosition: undefined,
    currentDirection: undefined,
    timeoutDelay: 500,
    movements: [],
    workspace: undefined, //blockly workspace
}

function init (initialPosition, initialDirection) {

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
    document.getElementById('map-panel').appendChild(squaresTable);
    
    global.currentPosition = initialPosition;
    global.currentDirection = initialDirection;

    let selectedSquare = document.getElementById('1');
    selectedSquare.className = selectedSquare.className + ' selected-square';

    generateBlock();

    global.workspace = Blockly.inject('blockly-panel', {
        toolbox: document.getElementById('toolbox')
    });
}

function generateBlock() {
    Blockly.Blocks['string_length'] = {
        init: function() {
          this.jsonInit({
                "type": "lists_repeat",
                "message0": "%{BKY_LISTS_REPEAT_TITLE}",
                "args0": [
                    {
                    "type": "input_value",
                    "name": "ITEM"
                    },
                    {
                    "type": "input_value",
                    "name": "NUM",
                    "check": "Number"
                    }
                ],
                "output": "Array",
                "colour": "%{BKY_LISTS_HUE}",
                "tooltip": "%{BKY_LISTS_REPEAT_TOOLTIP}",
                "helpUrl": "%{BKY_LISTS_REPEAT_HELPURL}"
          });
        }
      };
    // In Arabic. Note how %2 is left of %1, since it read right to left.
    Blockly.Msg.LISTS_REPEAT_TITLE = "إنشئ قائمة من العنصر  %1 %2 مرات";
}

function generateCode () {
    Blockly.JavaScript.addReservedWords('code');
    var code = Blockly.JavaScript.workspaceToCode(global.workspace);
    console.log(code);
}