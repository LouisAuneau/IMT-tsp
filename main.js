var _ = require('lodash');
var helpers = require('./helpers.js')

const USERNAME = "Les plus beaux";
const CROSSOVER_RATE = 0.3;
const POSITION_ORIGINE = {
    lat: 0.5,
    lng: 0.5
};

var problems = {
    // 1000 commandes
    problem1: {
        problem_id: 'problem1',
        orders: helpers.parseCsv('problem1.csv')
    },
    // 3000 commandes
    problem2: {
        problem_id: 'problem2',
        orders: helpers.parseCsv('problem2.csv')
    },
    // 3500 commandes un peu spéciales
    problem3: {
        problem_id: 'problem3',
        orders: helpers.parseCsv('problem3.csv')
    }
};

var main = function() {
    var size = 1000;
    var population = initializePopulation(size, problems.problem1.orders);
    var selection = select(500, population);

    console.log(evaluate(selection[0]));
    console.log(evaluate(selection[1]));
    console.log(evaluate(selection[2]));
}

var findClosestOrder = function (orders, pos) {
    orders = orders.sort(function (orderA, orderB) {
        return helpers.compute_dist(orderA.pos_lat, orderA.pos_lng, pos.lat, pos.lng) <= helpers.compute_dist(orderB.pos_lat, orderB.pos_lng, pos.lat, pos.lng)
    });
    return orders[orders.length-1];
}

/**
 * Initialize a population with random paths
 * @param {int} n Size of the population
 * @param {any[]} orders List of orders to use in order to create the population
 * @returns {any[][]}
 */
var initializePopulation = function (n, orders) {
    population = [];
    for(var i = 0; i < n; i++) {
        population.push(_.shuffle(orders));
    }
    return population;
}

/**
 * Evaluate one path.
 * @param {any[[]]} path
 */
var evaluate = function(orders) {
    var total_distance_solution = 0;
	var total_bonus_solution = 0;
    var pos = POSITION_ORIGINE;

    _.each(orders, function (order, i_order) {
		var distance_order = helpers.compute_dist(pos.lat, pos.lng, order.pos_lat, order.pos_lng);
        var bonus_order = Math.max(0, order.amount - i_order);

		total_distance_solution += distance_order;
		total_bonus_solution += bonus_order;
		
		pos.lat = order.pos_lat;
		pos.lng = order.pos_lng;
    });
    
    return total_bonus_solution - total_distance_solution;
}

/**
 * Select the best elements in the population.
 * @param {int} n Number of elements to select in the population. 
 * @param {any[[]]} orders List of orders in which we want to select the population. 
 */
var select = function(n, ordersPopulation) {
    var orderedOrdersPopulation = _.reverse(_.sortBy(ordersPopulation, function (orders) {
        return evaluate(orders);
    }));

    return _.take(orderedOrdersPopulation, n);
}

var crossoverPopulation = function (ordersPopulation) {

}

var crossoverCouple = function (orders1, orders2) {
    if (orders1.length != orders2.length)
        return new Error("orders not of the same length, unable to crossover");

    var sampleSize = Math.floor(CROSSOVER_RATE * orders1.length);
    var child1 = [];
    child1.length = orders1.length;
    var child2 = [];
    child2.length = orders2.length;
    var samplePosition = _.random(0, orders1.length - sampleSize);
    var sample1 = _.slice(orders1, samplePosition, samplePosition + sampleSize);
    orders1.splice(samplePosition, sampleSize);
    var sample2 = _.slice(orders2, samplePosition, samplePosition + sampleSize);
    orders2.splice(samplePosition, sampleSize);

    // Fill sample values into child orders
    for (var i = samplePosition; i < samplePosition + sampleSize; i++) {
        child1[i] =  sample2[i - samplePosition]
        child2[i] =  sample1[i - samplePosition]
    }
    
    // Fill remaining items for child1
    var i_order = 0;
    for (var i = 0; i < child1.length; i++) {
        var order = child1[i];
        if(order === undefined) {
            if(child1.indexOf(orders1[i_order]) == -1) {
                child1[i] = orders1[i_order];
            }
            i_order++;
        }
    };

    // Fill remaining items for child2
    var i_order = 0;
    for (var i = 0; i < child2.length; i++) {
        var order = child2[i];
        if(order === undefined) {
            if(child2.indexOf(orders2[i_order]) == -1) {
                child2[i] = orders2[i_order];
            }
            i_order++;
        }
    };
    
    console.log(child1);
    console.log(child2);
}

// main();

crossoverCouple([1, 2, 3, 4, 5, 6, 7, 8], [9, 10, 11, 12, 13, 14, 15, 16])