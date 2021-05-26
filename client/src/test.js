var global = {
    workspace: undefined
}

function init () {
    global.workspace = Blockly.inject('bricks-panel', {
        toolbox: document.getElementById('toolbox')
    });
}

function onClick () {
    Blockly.JavaScript.addReservedWords('code');
    let code = Blockly.JavaScript.workspaceToCode(global.workspace);

    try {
        console.log(code);
        eval("window.alert(Fuck you);");
    } catch (e) {
        alert(e);
    }
}
