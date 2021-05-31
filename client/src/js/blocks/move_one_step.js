Blockly.Blocks['one_step'] = {
    init: function() {
      this.jsonInit({
            "type": "one_step",
            "message0": "تحرك خطوة واحدة",
            "previousStatement": null,
            "nextStatement": null,
            "args0": [],
            "colour": "#1a1",
            "tooltip": "تحرك خطوة واحدة",
      });
    }
  };

// Code generator
Blockly.JavaScript['one_step'] = function (block) {
    return 'oneStep();\n';
}