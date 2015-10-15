# CogAI backpropagation neural network & Genetic algorithm

Create a backpropagation neural network & genetic algorithm.

DEMO:

A. [Neural Network - XOR example](http://nodejs101.herokuapp.com/cog_ai/backpropagation?il=2&hl=2&ol=1&lr=2.5&mt=1&ge=4&bs=true&tf=xor.csv&ef=xor_test.csv)

B. [Genetic Algorithm - Traveling Salesman Problem](http://nodejs101.herokuapp.com/cog_ai/ga/tsp?pop_size=500&generation=500&cost_file=tsp.csv)

## Installation

	$ npm install cog-ai

## API

	cog_ai = require('cog-ai')

## Example

Declaration:

	cog_ai = require('cog-ai')

### A. Neural Network

Setup options for neural network:

	options = {
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

	net = new cog_ai.Backpropagation(options)

To train the network:

	error = net.train(inputs, outputs)
	inputs = [1, 1]
	outputs = [0]

To evaluate the network:

	net.eval(inputs)
	inputs = [1, 1]

### B. Genetic Algorithm

Setup costs matrix for genetic algorithm

	Costs = cog_ai.Costs
	Costs.labels = ['id', 'title', 'price']
	Costs.matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

Setup options for genetic algorithm:

	options = {
			population_size : 800,
			generations : 500
		}

Create a genetic algorithm instance:

	ga = new cog_ai.GA(options)
	// start evolving
	solution = ga.evolve()
	// get best fitness
	solution.fitness

### [MIT Licensed](LICENSE)
