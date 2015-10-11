/**
 * 
 * @param x
 * @returns {Number}
 */
exports.activation = function(x) {
	return 1 / (1 + Math.exp(-1 * x));
}

exports.derivative_activation = function(x) {
	return x * (1 - x);
}
