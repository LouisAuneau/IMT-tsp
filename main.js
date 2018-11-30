var _ = require('lodash');
var helpers = require('./helpers.js')

const USERNAME = "Rémi G. x Louis A.";
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

main();