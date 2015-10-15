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
var Chromosome = require('./chromosome');
var Utils = require('../utils/utils');

/**
 * Module exports.
 */

module.exports = GA;

function GA(options) {
	this.population_size = options.population_size || 100;
	this.max_generation = options.generations || 100;
	this.generation = 0;
	this.population = [];

	this.population = Array.apply(null, Array(parseInt(this.population_size))).map(
			function(item, i) {
				return new Chromosome();
			});
} // GA

/**
 * 
 */
GA.prototype.evolve = function() {
	// Step 1: Initialize population
	initialize_population();

	for (var i = 0; i < this.max_generation; i++) {
		// Step 2: Selection
		var mating_pool = this.selection();

		// Step 3: Reproduction (crossover & mutation)
		this.reproduction(mating_pool);
	}

	return best_chromosome(this.population);

	function initialize_population() {
	}

	function best_chromosome(pop) {
		var best_fitness = pop[0].fitness;
		var index = 0;
		pop.forEach(function(chromosome, i) {
			if (chromosome.fitness > best_fitness) {
				best_fitness = chromosome.fitness;
				index = i;
			}
		});

		return pop[index];
	} // best_chromosome()

} // evolve()

/**
 * Step 2: Selection
 * Step 2a: Calculate fitness
 * Step 2b: Build mating pool - using Roulette Wheel Selection
 * Parents are selected according to their fitness.
 * The better the chromosomes are, the more chances to be selected they have.
 * Chromosome with bigger fitness will be selected more times.
 * 
 * @returns {mating_pool}
 */
GA.prototype.selection = function() {
	var fitness = this.population.map(function(chromosome) {
		return chromosome.fitness;
	});
	var max_fitness = Math.max.apply(null, fitness);
	var min_fitness = Math.min.apply(null, fitness);
	var accumulate_normalized_fitness = 0;
	var offset_fitness = max_fitness - min_fitness;
	if (offset_fitness > 0) {
		this.population.forEach(function(chromosome, i) {
			chromosome.normalized_fitness = (chromosome.fitness - min_fitness) / offset_fitness;
			accumulate_normalized_fitness += chromosome.normalized_fitness;
		});
	} else {
		// in case of offset_fitness = 0
		this.population.forEach(function(chromosome, i) {
			chromosome.normalized_fitness = 1;
		});
	}

	var mating_pool = [];

	var pop_size = this.population_size;
	this.population.forEach(function(chromosome, index) {
		var num_select;
		if (accumulate_normalized_fitness == 0)
			num_select = 1
		else
			num_select = Math.round(chromosome.normalized_fitness / accumulate_normalized_fitness
					* pop_size);
		for (var i = 0; i < num_select; i++)
			mating_pool.push(chromosome);
	});

	return mating_pool
} // selection()

/**
 * Step 3: Reproduction
 * Step 3a: Crossover
 * Step 3b: Mutation
 * 
 * @returns {none}
 */
GA.prototype.reproduction = function(mating_pool) {
	var pop = this.population;
	pop.forEach(function(chromosome, i) {
		var r1 = Utils.rand(mating_pool.length);
		var r2 = Utils.rand(mating_pool.length);
		pop[i] = chromosome.crossover(mating_pool[r1], mating_pool[r2]);
		pop[i].mutate();
	});
	this.population = pop;
} // reproduction()

