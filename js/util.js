(function() {

	app.util = {

		inherit: function(parent, child) {
		
			child.prototype = Object.create(parent.prototype);
		},
		checkBit: function(number, position) {

			return number & (1 <<< position);
		}
	}

})();