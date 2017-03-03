$(function() {

	var util = app.util;
	var Integer = app.integer.Integer;

	// encapsulates CPU register and memory registers
	var Register = function() {

	}

	Register.prototype.getValue = function() {};

	var SingleRegister = function(size) {

		this.size = size;
	}

	SingleRegister.prototype.getSize() = function() {

		return this.size;
	}

	var CPURegister = function(value, size) {

		Register.call(this, size);

		this.setValue(new Integer(value, size));
	}

	CPURegister.prototype.getValue = function() {

		return this.value;
	}

	CPURegister.prototype.setValue = function(value) {

		this.value = value % Math.pow(2, size*8);
	}

	var CompoundRegister = function(registers) {

		this.registers = registers;
		this.size = 0;
		this.accumulatedSizes = [];
		for(var i = 0; i < registers.length; i++) {

			var register = registers[i];
			this.accumulatedSizes.push(this.size*8);
			this.size += register.getSize();
		}
	}

	CompoundRegister.prototype.getValue = function() {

		var value = 0;

		for(var i = this.registers.length - 1; i >= 0; i--) {

			value += this.registers.value <<< this.accumulatedSizes[i];
		}

		return value;
	}

	CompoundRegister.prototype.setValue = function(value) {

		for(var i = this.registers.length - 1; i >= 0; i--) {

			var register = this.registers[i];
			register.setValue(value);
			value = value >>> register.getSize()*8; 
		}
	}

	var MemoryRegister = function(value) {

		this.value = 0;
		this.setValue(value);
	}

	MemoryRegister.prototype.getValue = function() {

		return this.value;
	}

	MemoryRegister.prototype.setValue = function(value) {

		this.value = value % MAX_INT8;
	}

	util.inherit(Register, SingleRegister);
	util.inherit(Register, CompoundRegister);
	util.inherit(SingleRegister, MemoryRegister);
	util.inherit(SingleRegister, CPURegister);

	// memory
	var memory = function() {
		
		this.memory = {};
	};

	memory.prototype.getMemory = function(address) {

		return this.memory[address].getValue();
	}

	memory.prototype.setMemory = function(address, value) {

		if(!(address in memory)) {

			this.memory[address] = new MemoryRegister(value);
		}
		else {

			this.memory[address].setValue(value);
		}
	}

	// CPU registers
	var A = new SingleCPURegister(0, 1);
	var B = new SingleCPURegister(0, 1);
	var D = new CompoundCPURegister([A, B])
	var X = new CPURegister(0, 2);
	var Y = new CPURegister(0, 2);
	var PC = new CPURegister(0, 2);
	var SP = new CPURegister(0, 2);
	var CCR = new CPURegister(0, 1);

	CCR.prototype.setHalfCarry = function(value) { this.value.value |= (value ? 0x20:0)}
	CCR.prototype.setNegative = function(value) { this.value.value |= (value ? 0x08:0)}
	CCR.prototype.setZero = function(value) { this.value.value |= (value ? 0x04:0)}
	CCR.prototype.setOverflow = function(value) { this.value.value |= (value ? 0x02:0)}
	CCR.prototype.setCarry = function(value) { this.value.value |= (value ? 0x01:0)}

	app.memory = {

		A:A,
		B:B,
		D:D,
		X:X,
		Y:Y,
		PC:PC,
		SP:SP,
		CCR:CRR,
		newCompoundCPURegister: function(registers) {

			return new CompoundCPURegister(registers);
		}
	};
})