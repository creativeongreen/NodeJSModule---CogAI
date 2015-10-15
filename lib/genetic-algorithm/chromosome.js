/*!
 * cog-ai/lib/genetic_algorithm
 * Copyright(c) 2015-2018 Creativeongreen
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 * 
 * @private
 */
var Utils = require('../utils/utils');
var Costs = require('./costs');

/**
 * Module exports.
 */

module.exports = Chromosome;

function Chromosome() {
	this.genes = randomize_gene();
	this.fitness = this.calculate_fitness();
	this.normalized_fitness;

	function randomize_gene() {
		var data_size = Costs.matrix[0].length;
		var tmp_genes = Array.apply(null, Array(data_size)).map(function(arr, i) {
			return i;
		});

		var random_genes = [];
		while (tmp_genes.length > 0) {
			// generate a random number between 0 ~ (tmp_genes.length -1)
			var index = Utils.rand(tmp_genes.length);
			random_genes.push(tmp_genes[index]);
			tmp_genes.splice(index, 1);
		}

		return random_genes;
	} // randomize_gene()

} // Chromosome

Chromosome.prototype.calculate_fitness = function() {
	var start_gene = this.genes[0];
	var cost = 0;

	this.genes.forEach( function(end_gene, index) {
		cost += Costs.matrix[start_gene][end_gene];
		start_gene = end_gene;
	});

	this.fitness = -1 * cost;

	return -1 * cost;
} // calculate_fitness()

/**
 * 
 */
Chromosome.prototype.crossover = function(p1, p2) {
	var data = p1.genes;
	var r1 = Utils.rand(data.length);
	var r2 = Utils.rand(data.length);
	if (r1 > r2) {
		var temp = r1, r1 = r2, r2 = temp;
	}

	var child = [];
	// fill up child gene with range index from parent p1
	for (var i=r1; i <= r2; i++) {
		child[i] = p1.genes[i];
	}

	// fill up child remaining gene positions from parent p2
	var index = 0;
	if (r1 != 0) {
		for (var i=0; i < r1; i++) {
			while (child.include(p2.genes[index])) {
				index = index + 1;
			}
			child[i] = p2.genes[index];
			index = index + 1;
		}
	}

	if (r2 < data.length-1) {
		for (var i=r2+1; i < data.length; i++) {
			while (child.include(p2.genes[index])) {
				index = index + 1;
			}
			child[i] = p2.genes[index];
			index = index + 1;
		}
	}

	var chromosome = new Chromosome();
	chromosome.genes = child;
	chromosome.calculate_fitness();

	return chromosome;
} // crossover()

/**
 * swap mutation:
 * swap two randomly selected genes positions
 * 
 */
Chromosome.prototype.mutate = function() {
	var mutation_rate = 0.00001;

	if (Math.random() <= mutation_rate) {
		var data = this.genes;
		var r1 = Utils.rand(data.length);
		var r2 = Utils.rand(data.length);
		var temp = data[r1];
		data[r1] = data[r2];
		data[r2] = temp;
		this.genes = data;
		this.calculate_fitness();
	}

	return this;
} // mutate()
