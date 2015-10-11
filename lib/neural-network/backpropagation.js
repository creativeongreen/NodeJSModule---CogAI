/*!
 * cog-ai/lib/backpropagation
 * Copyright(c) 2015-2018 Creativeongreen
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 * 
 * @private
 */
var act = require('../activation/sigmoid_activation');

/**
 * Module exports.
 */

module.exports = Backpropagation;

function Backpropagation(options) {
	var layers = options.layers;
	var learning_rate = options.learning_rate || 0.3;
	var momentum = options.momentum || 0.1;
	var has_bias = options.has_bias;
	var neurons;
	var weights;
	var previous_weight_changes;
	var deltas;

	initialize();

	this.train = function(inputs, outputs) {
	    check_input_dimension(inputs.length);
	    check_output_dimension(outputs.length);
	    feedforward(inputs);
	    backpropagate(outputs);
	    return calculate_error(outputs);
	} // train()

	this.eval = function(inputs) {
		check_input_dimension(inputs.length);
		feedforward(inputs);
		return neurons[neurons.length - 1];
	}

	function feedforward(inputs) {
    	// assign input values to the neurons on input layer
    	inputs.forEach(function(input, i) {
    		neurons[0][i] = input;
    	});

    	// calculate the output value of each neuron on hidden & output layers
		// step 1: compute sum of weights
		// step 2: compute value via activation function
    	weights.forEach(function(weight, layer_index) {
    		for (var j=0; j < layers[layer_index+1]; j++) {
    			var sum = 0.0;
    			neurons[layer_index].forEach(function(neuron, i) {
    				sum += (neuron * weight[i][j]);
    			});
    			neurons[layer_index+1][j] = act.activation(sum);
    		};
    	});
    } // feedforward()

    function backpropagate(expected_output_values) {
        calculate_output_layer_deltas(expected_output_values);
        calculate_inner_layer_deltas();
        update_weights();
    } // backpropagate()

	/**
	 * Calculate neuron deltas on output layer
	 * e.g.: layers = [3, 4, 3, 2]
	 * => deltas = [ [ matrix 1x2 ] ]
	 */
    function calculate_output_layer_deltas(expected_outputs) {
    	var actual_outputs = neurons[neurons.length - 1];
    	var tmp_output_deltas = [];
    	actual_outputs.forEach(function(output, index) {
    		var error = expected_outputs[index] - output;
    		tmp_output_deltas.push(act.derivative_activation(output) * error);
    	});
    	deltas = [];
    	// add results to the first of an array
    	deltas.unshift(tmp_output_deltas);
    }

	/**
	 * Calculate neuron deltas on inner layer
	 * e.g.: layers = [3, 4, 3, 2]
	 * => deltas = [ [ matrix 5x1 ], [ matrix 4x1 ], [ matrix 1x2 ] ]
	 */
    function calculate_inner_layer_deltas() {
    	// init tmp to_layer deltas with last deltas (neuron deltas on output layer)
    	var tmp_to_layer_deltas = deltas[deltas.length - 1];
    	// go through from upper inner layer to lower inner layer
    	for (var from_layer_index=neurons.length-2; from_layer_index >= 1; from_layer_index--) {
    		var tmp_layer_deltas = [];
    		neurons[from_layer_index].forEach(function(neuron, j) {
    			var sum = 0.0;
    			for (var k=0; k < layers[from_layer_index+1]; k++) {
    				sum += tmp_to_layer_deltas[k] * weights[from_layer_index][j][k];
    			}
    			tmp_layer_deltas[j] = act.derivative_activation(neurons[from_layer_index][j]) * sum;
    		});
    		// add results to the first of an array
    		deltas.unshift(tmp_layer_deltas);
    		tmp_to_layer_deltas = tmp_layer_deltas;
    	}
    }

    // Update weights after neuron deltas have been calculated.
    function update_weights() {
    	for (var layer_index=weights.length-1; layer_index >= 0; layer_index--) {
    		weights[layer_index].forEach(function(w1, j) {
    			weights[layer_index][j].forEach(function(w2, k) {
    				var weight_change = learning_rate * neurons[layer_index][j] * deltas[layer_index][k];
    				w1[k] += ( weight_change +
    		                  momentum * previous_weight_changes[layer_index][j][k]);
    		        previous_weight_changes[layer_index][j][k] = weight_change;
    		    });
    		});
    	}
    }

    // Error = sum( (expected_value[i] - actual_output_value[i])**2 ) / 2
    function calculate_error(expected_outputs) {
    	var actual_output_values = neurons[neurons.length - 1];
    	var error = 0.0;
    	expected_outputs.forEach(function(output, i) {
    		var diff = actual_output_values[i] - output;
            error += 0.5 * diff * diff;
    	});

    	return error;
    } // calculate_error()

    function initialize() {
		init_neurons();
		init_weights();
		init_previous_weight_changes();
	}

    /**
     * e.g.: [3, 4, 2]
     * => neurons = [ [1.0, 1.0, 1.0, bias], [1.0, 1.0, 1.0, 1.0, bias], [1.0, 1.0] ]
     */
	function init_neurons() {
		neurons = Array.apply(null, Array(layers.length)).map(function(arr, i) {
			var num_neurons = layers[i];
			return Array.apply(null, Array(num_neurons)).map(function(arr, j) {
				return 1;
			});
		});

		if (has_bias) {
			layers.forEach(function(x, i) {
				if (i < layers.length - 1)
					neurons[i].push(1);
			});
		}
	} // init_neurons()

	/**
	 * e.g.: layers = [3, 4, 2]
	 * => weights with bias = [ [ matrix (3+1)x4 ], [ matrix (4+1)x2 ] ]
	 */
	function init_weights() {
		weights = Array.apply(null, Array(layers.length - 1)).map(function(x, i) {
			var to_len = layers[i + 1];
			var from_len = layers[i];
			// add bias weights if define bias
			if (has_bias) from_len++;

			return Array.apply(null, Array(from_len)).map(function(x, i) {
				return Array.apply(null, Array(to_len)).map(function(y, j) {
					return Math.random();
				});
			});
		});
	} // init_weights()

    // Momentum usage need to know how much a weight changed in the previous training. 
    // This method initialize the @previous_weight_changes structure with 0 values.
	function init_previous_weight_changes() {
		previous_weight_changes = 
			Array.apply(null, Array(weights.length)).map(function(arr, i) {
				// weights[i]: an array of a layer
				return Array.apply(null, Array(weights[i].length)).map(function(arr, j) {
					// weights[i][j]: an array connections of a neuron
					return Array.apply(null, Array(weights[i][j].length)).map(function(arr, k) {
						return 0.0;
					});
				});
			});
	}

	function check_input_dimension(in_len) {
    	if (in_len === layers[0]) {
    		return true;
    	}
    	else {
    		console.log("Wrong number of inputs. Expected: " + layers[0] + ", received: " + in_len + ".")
    	}
    } // check_input_dimension()

    function check_output_dimension(out_len) {
    	if (out_len === layers[layers.length -1]) {
    		return true;
    	}
    	else {
    		console.log("Wrong number of outputs. Expected: " + layers[layers.length -1] + ", received: " + out_len + ".")
    	}
    } // check_output_dimension()

} // Backpropagation
