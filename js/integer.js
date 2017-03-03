$(function() {

	// immutable, fixed-sized integer (size in bytes)
	var Integer = function(value, size) {

		this.size = size;
		this.value = value % Math.pow(2, size*8);
	};

	Integer.prototype.getValue = function(value) {

		return this.value;
	}

	Integer.prototype.add = function(addend, size) {

		size = size || this.size;

		return new Integer(this.getValue() + addend.getValue(), size);
	}

	Integer.prototype.subtract = function(subtrahend, size) {

		size = size || this.size;

		return new Integer(this.getValue() - subtrahend.getValue(), size);
	}	

	Integer.prototype.multiply = function(multiplier, size) {

		size = size || this.size;

		return new Integer(this.getValue() * multiplier.getValue(), size);
	}

	Integer.prototype.divide = function(divisor, size) {

		size = size || this.size;

		return new Integer(Math.floor(this.getValue() / divisor.getValue(), size));
	}

	Integer.prototype.modulo = function(divisor, size) {

		size = size || this.size;

		return new Integer(this.getValue() % divisor.getValue(), size);
	}

	app.integer = {
		Integer:Integer
	};

});