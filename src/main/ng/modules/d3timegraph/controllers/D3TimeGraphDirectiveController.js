(function() {
    var d3 = require('d3');
    var $ = require('jquery');

    var lineColors = [
        '#7fc97f','#beaed4','#fdc086','#a6611a','#386cb0',
        '#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e',
        '#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99',
        '#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00',
        '#8dd3c7','#5e3c99','#bebada','#fb8072','#80b1d3',
        '#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854'
    ];

    /**
     * @type {number} The maximum allowed data series in the graph.
     */
    var MAX_ALLOWED_DATA_SERIES = 30;

    /**
     * @type {number} Time-graph ratio of width to height, to determine height is not specified by the user.
     */
    var WIDTH_TO_HEIGHT_RATIO = 16 / 9;

    /**
     * @type {{top: number, right: number, bottom: number, left: number}} margins of the time graph
     */
    var MARGINS = {top: 30, right: 20, bottom: 60, left: 50};

    var CANVAS_SELECTOR = '';

    /**
     * @constructor
     * @see http://bl.ocks.org/d3noob/b3ff6ae1c120eea654b5
     */
    function D3TimeGraphDirectiveCtrl($element, $scope, $log, $window) {
        'ngInject';

        var vm = this;

        // Hold on to service references
        vm.log = $log;
        vm.scope = $scope;
        vm.element = $element[0];
        vm.window = $window;

        // d3 time graph variables
        vm.x = undefined;
        vm.y = undefined;
        vm.xAxis = undefined;
        vm.yAxis = undefined;
        vm.svg = undefined;
        vm.graphHeight = undefined;
        vm.graphWidth = undefined;

        vm.$svgDiv = $('.myBarDirective');
        vm.svgDiv = d3.select(vm.element).select('div > div .myBarDirective');
    }

    /**
     * D3 Parse date function.
     */
    var parseDate = d3.timeParse('%Y-%m-%d');

    /**
     * Get the extent (minimum, maximum) of the all of the data series dates.
     * @param data data to find smallest and largest date.
     * @param key which key of the data series contains the date.
     * @returns Array array with two date, smallest and largest respectively.
     */
    var getNestedDateExtent = function (data, key) {
        // get the nested dates with the specified key
        // get all the data series points
        var points = _.reduce(data, function(acc, item) {acc.push(item.points); return acc;}, [])
        var dates = _.map(_.flatten(points), function(item) { return parseDate(item[key])});

        // sort the dates
        var sortedDates = _.sortBy(dates, function(date) { return date});

        var minDate, maxDate;

        if(sortedDates.length > 0) {
            minDate = sortedDates[0];
            maxDate = sortedDates[sortedDates.length - 1];
        }

        return [minDate, maxDate];
    };

    /**
     * Initialize all needed watches and the triggering of the D3 redrawing
     */
    D3TimeGraphDirectiveCtrl.prototype.initialize = function() {
        var vm = this;

        // todo make 200 a constant
        // debounced redraw function, so it can't be called too quickly.
        var debouncedRedraw = _.debounce(function() {
            vm.redraw();
        }, 200);

        // on window size change, redraw
        vm.scope.$watch(function() { return vm.window.innerHeight + vm.window.innerWidth; }, function() {
            debouncedRedraw();
        });

        // on source data change, redraw
        vm.scope.$watch(function() { return vm.sourceData; }, function(newData) {
            vm.log.info('sourceData changed', newData);
            debouncedRedraw();
        }, true);

        // watch resize events
        angular.element(vm.window).bind('resize', function () {
            vm.scope.$apply();
            vm.log.info('resize');
        });
    };

    /**
     * Updates the time graph based on the data
     */
    D3TimeGraphDirectiveCtrl.prototype.updateData = function() {
        var vm = this;

        // Scale the domain range of the data
        vm.y.domain([
            d3.min(vm.sourceData, function(c) { return d3.min(c.points, function(d) { return d.y; }); }),
            d3.max(vm.sourceData, function(c) { return d3.max(c.points, function(d) { return d.y; }); })
        ]);
        var dateExtent = getNestedDateExtent(vm.sourceData, 'x');
        if (dateExtent === undefined || dateExtent[0] === undefined) {
            throw 'Invalid dates passed in.';
        }
        vm.x.domain(getNestedDateExtent(vm.sourceData, 'x'));

        var valueLine = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return vm.x(d.date); })
            .y(function(d) { return vm.y(d.close); });

        _.forEach(vm.sourceData, function(data, index) {
            // check we haven't passed our max support number of data series
            if (index >= MAX_ALLOWED_DATA_SERIES) {
                vm.log.warn('Exceed the maximum supported data series of ' + MAX_ALLOWED_DATA_SERIES);
                // break from _.forEach
                return false;
            }

            // remap the data
            var cleanedData = _.map(data.points, function(d) {
                return  {date: parseDate(d.x), close: +d.y};
            });

            // Add the valueline path.
            vm.svg.append('path')
                .attr('class', 'line')
                .attr('stroke', lineColors[index])
                .attr('stroke-width', 2)
                .attr('fill', 'none')
                .attr('d', valueLine(cleanedData));
        });

        // Add the X Axis
        vm.svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + vm.graphHeight + ')')
            .call(vm.xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        // Add the Y Axis
        vm.svg.append('g')
            .attr('class', 'y axis')
            .call(vm.yAxis);
    };

    /**
     * draws + redraws the time graph.
     */
    D3TimeGraphDirectiveCtrl.prototype.redraw = function() {
        var vm = this;

        // Set the dimensions of the canvas / graph
        var divWidth = vm.$svgDiv.width();

        vm.graphWidth = divWidth - MARGINS.left - MARGINS.right;
        vm.graphHeight = (divWidth / WIDTH_TO_HEIGHT_RATIO) - MARGINS.top - MARGINS.bottom;

        // Adds/Replaces the SVG canvas
        // var $svgDiv = $(vm.element);
        var oldSvg = vm.svgDiv.select('svg');
        if(oldSvg) {
            oldSvg.remove();
        }
        vm.svg = vm.svgDiv
            .append('svg')
            .attr('width', vm.graphWidth + MARGINS.left + MARGINS.right)
            .attr('height', vm.graphHeight + MARGINS.top + MARGINS.bottom)
            .append('g')
            .attr('transform',
                'translate(' + MARGINS.left + ',' + MARGINS.top + ')');

        // Set the ranges
        vm.x = d3.scaleTime().range([0, vm.graphWidth]);
        vm.y = d3.scaleLinear().range([vm.graphHeight, 0]);

        // Define the axes
        vm.xAxis = d3.axisBottom(vm.x);
        vm.yAxis = d3.axisLeft(vm.y);

        // now update with Data
        vm.updateData();
    };

    var app = require('angular').module('swf.ng.app');
    app.controller('D3TimeGraphDirectiveCtrl', D3TimeGraphDirectiveCtrl);
})();
