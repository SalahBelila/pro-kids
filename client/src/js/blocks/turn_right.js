Blockly.Blocks['turn_right'] = {
    init: function() {
      this.jsonInit({
            "type": "turn_right",
            "message0": "↻ إستدر نحو اليمين",
            "previousStatement": null,
            "nextStatement": null,
            "args0": [],
            "colour": "#1a1",
            "tooltip": "إستدر نحو اليمين",
      });
    }
  };

// Code generator
Blockly.JavaScript['turn_right'] = function (block) {
    return 'turnRight();\n';
}