/**
 * 
 * @param x: {Number}
 * @returns {Number}
 */
exports.rand = function(x) {
	return Math.round(Math.random() * (x - 1));
}

/**
 * 
 * @param arr: Array
 * @returns {Number}
 */
exports.max = function(arr) {
	return Math.max.apply(Math, arr.map( function(obj) { return obj } ));
}

/**
 * 
 * @param arr: Array
 * @returns {Number}
 */
exports.min = function(arr) {
	return Math.min.apply(Math, arr.map( function(obj) { return obj } ));
}

/**
 * 
 * @param x: Array
 * @returns {true | false}
 */
Array.prototype.include = function(x) {
	return this.indexOf(x) > -1 ? true : false;
}
