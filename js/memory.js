$(function() {

	var util = app.util;
	var MAX_INT8 = Math.pow(2, 8);
	var MAX_INT16 = Math.pow(2, 16);

	// encapsulates CPU register and memory registers
	var Register = function() {

	}

	var CPURegister = function() {

	}

	var SingleCPURegister = function(value, size) {

		this.value = 0;
		this.setValue(value);
		this.size = size;
	}

	SingleCPURegister.prototype.getValue = function() {

		return this.value;
	}

	SingleCPURegister.prototype.setValue = function(value) {

		this.value = value % Math.pow(2, size*8);
	}

	var CompoundCPURegister = function(registers) {

		this.registers = registers;
		this.size = 0;
		this.accumulatedSizes = [];
		for(var i = 0; i < registers.length; i++) {

			var register = registers[i];
			this.accumulatedSizes.push(this.size*8);
			this.size += register.size;
		}
	}

	CompoundCPURegister.prototype.getValue = function() {

		var value = 0;

		for(var i = this.registers.length - 1; i >= 0; i--) {

			value += this.registers.value <<< this.accumulatedSizes[i];
		}

		return value;
	}

	CompoundCPURegister.prototype.setValue = function(value) {

		for(var i = this.registers.length - 1; i >= 0; i--) {

			var register = this.registers[i];
			register.setValue(value);
			value = value >>> register.size*8; 
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

	util.inherit(Register, MemoryRegister);
	util.inherit(Register, CPURegister);
	util.inherit(CPURegister, CompoundCPURegister);
	util.inherit(CPURegister, SingleCPURegister);

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