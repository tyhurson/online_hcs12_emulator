$(function() {

	var memory = app.memory;
	var util = app.util;
	var A = memory.A;
	var B = memory.B;
	var D = memory.D;
	var X = memory.X;
	var Y = memory.Y;
	var CCR = memory.CCR;
	var cb = util.checkBit;

	var Operation = function() {

	};

	Operation.prototype.setHalfCarry = function() {};
	Operation.prototype.setNegative = function() {};
	Operation.prototype.setZero = function() {};
	Operation.prototype.setOverflow = function() {};
	Operation.prototype.setCarry = function() {};
	Operation.prototype.execute = function() {};

	var Addition = function() {

		Operation.call(this);
	};

	Addition.prototype.setHalfCarry = function() {

	};

	var Instruction = function(inputs, outputs, executor) {

		this.inputs = inputs;
		this.outputs = outputs;
		this.executor = executor;
	};

	var binary_addition8 = function(inputs, outputs) {

		this.outputs[0].setValue(this.inputs[0].getValue() + this.inputs[1].getValue());

		CCR.setHalfCarry(
			cb(this.inputs[0], 3) &&
			cb(this.inputs[1], 3) ||
			cb(this.inputs[1], 3) &&
			!cb(this.outputs[0], 3) ||
			!cb(this.outputs[0], 3) &&
			cb(this.inputs[0], 3)
		);

		CCR.setNegative(
			cb(this.outputs[0], 7)
		);

		CCR.setZero(
			cb(this.outputs[0] == 0),
		);

		CCR.SetOverflow(
			cb(this.inputs[0], 7) &&
			cb(this.inputs[1], 7) &&
			!cb(this.outputs[0], 7) ||
			!cb(this.inputs[0], 7) &&
			!cb(this.inputs[1], 7) &&
			cb(this.outputs[0], 7)
		);

		CCR.setCarry(

		);
	};

	var instructions = {

		aba: new Instruction([A, B], [A], function() {


		})
	};

	app.instructions = {

	};
});