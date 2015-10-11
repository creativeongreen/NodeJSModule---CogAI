# CogAI backpropagation neural network

Create a backpropagation neural network.

## Installation

$ npm install cog-ai

## API

var cog_ai      = require('cog-ai')

## Example

Declaration:

	var cog_ai      = require('cog-ai')

Setup options for network:

	var options = {
			layers : [ 2, 2, 1 ],
			learning_rate : 0.3,
			momentum : 0.1,
			has_bias : true
		}

	- Note -
		
	layers: define an array for layers:
	[ number_of_neurons_on_input_layer, 
	  number_of_neurons_on_hidden_layer, 
	  number_of_neurons_on_output_layer ]
		
	learning_rate: value between 0 ~ 1
	momentum : value between 0 ~ 1

Create a network instance:

	var net = new cog_ai.Backpropagation(options)

To train the network:

	error = net.train(inputs, outputs)

To evaluate the network:

	net.eval(inputs)

### [MIT Licensed](LICENSE)
