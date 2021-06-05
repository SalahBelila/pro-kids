Blockly.Blocks['turn_left'] = {
    init: function() {
      this.jsonInit({
            "type": "turn_left",
            "message0": "↺ إستدر نحو اليسار",
            "previousStatement": null,
            "nextStatement": null,
            "args0": [],
            "colour": "#1a1",
            "tooltip": "إستدر نحو اليسار",
      });
    }
  };

// Code generator
Blockly.JavaScript['turn_left'] = function (block) {
    return 'turnLeft();\n';
}