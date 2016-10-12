(function() {
    var d3 = require('d3');

    var LINE_COLORS = [
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
     * @type {number} Amount of time to debounce, in milliseconds, calls to the SVG redraw function.
     */
    var DEBOUNCE_TIME_MS = 200;

    /**
     * @type {{top: number, right: number, bottom: number, left: number}} margins (px) of the time graph
     */
    var MARGINS = {top: 30, right: 20, bottom: 60, left: 50};

    /**
     * @type {number} percentage of the time graph width to be used for the legend (if enabled)
     */
    var LEGEND_WIDTH_PERCENT = 20;

    /**
     * @constructor D3 Time Graph directive controller constructor.
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
        vm.legendWidth = undefined;
        vm.colors = undefined;

        vm.svgDiv = d3.select(vm.element).select('div > div .myBarDirective');
    }

    /**
     * D3 Parse date function.
     */
    var parseDate = d3.timeParse('%Y-%m-%d');

    /**
     * D3 Parse ISO time function.
     */
    var parseTime = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");

    /**
     * Get the extent (minimum, maximum) of the all of the data series dates.
     * @param type if the data is of type 'time' or 'date'
     * @param data data to find smallest and largest date.
     * @param key which key of the data series contains the date.
     * @returns Array array with two date, smallest and largest respectively.
     */
    var getNestedDateExtent = function (type, data, key) {
        // get the nested dates with the specified key
        // get all the data series points
        var points = _.reduce(data, function(acc, item) {acc.push(item.points); return acc;}, []);
        var dates;
        switch(type) {
            case 'time':
                dates = _.map(_.flatten(points), function(item) { return parseTime(item[key])});
                break;
            case 'date':
                dates = _.map(_.flatten(points), function(item) { return parseDate(item[key])});
                break;
            default:
                throw 'Invalid Type ' + type;
        }

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

        // debounced redraw function, so it can't be called too frequently consecutively.
        var debouncedRedraw = _.debounce(function() {
            vm.redraw();
        }, DEBOUNCE_TIME_MS);

        // on window size change, redraw
        vm.scope.$watch(function() { return vm.window.innerHeight + vm.window.innerWidth; }, function() {
            debouncedRedraw();
        });

        // on source data change, redraw
        vm.scope.$watch(function() { return vm.type; }, function(newData) {
            vm.log.info('type changed', newData);
            debouncedRedraw();
        }, true);

        // on source data change, redraw
        vm.scope.$watch(function() { return vm.sourceData; }, function(newData) {
            vm.log.info('sourceData changed', newData);
            debouncedRedraw();
        }, true);

        // on source data change, redraw
        vm.scope.$watch(function() { return vm.showLegend; }, function(newData) {
            vm.log.info('show legend changed', newData);
            debouncedRedraw();
        }, true);

        // on height/width change, redraw
        vm.scope.$watch(function() { return vm.height + vm.width; }, function(newData) {
            vm.log.info('size changed', newData);
            debouncedRedraw();
        }, true);

        // watch resize events
        angular.element(vm.window).bind('resize', function () {
            vm.log.info('resize');
            vm.scope.$apply();
        });
    };

    /**
     * @returns {{width: number, height: number}} Object of width and height.
     */
    D3TimeGraphDirectiveCtrl.prototype.getSize = function() {
        var vm = this;

        var width = vm.width || parseInt(vm.svgDiv.style('width'));
        var height = vm.height || (width / WIDTH_TO_HEIGHT_RATIO);


        return {width: width, height: height};
    };

    /**
     * Updates the time graph based on the data
     */
    D3TimeGraphDirectiveCtrl.prototype.updateData = function() {
        var vm = this;

        // Scale the domain range of the data
        vm.y.domain([
            d3.min(vm.sourceData, function(dataSeries) { return d3.min(dataSeries.points, function(data) { return data.y; }); }),
            d3.max(vm.sourceData, function(dataSeries) { return d3.max(dataSeries.points, function(data) { return data.y; }); })
        ]);
        var dateExtent = getNestedDateExtent(vm.type, vm.sourceData, 'x');
        if (dateExtent === undefined || dateExtent[0] === undefined) {
            throw 'Invalid dates passed in.';
        }
        vm.x.domain(dateExtent);

        var valueLine = d3.line()
            .x(function(data) { return vm.x(data.x); })
            .y(function(data) { return vm.y(data.y); });

        _.forEach(vm.sourceData, function(data, index) {
            // check we haven't passed our max support number of data series
            if (index >= MAX_ALLOWED_DATA_SERIES) {
                vm.log.warn('Exceed the maximum supported data series of ' + MAX_ALLOWED_DATA_SERIES);
                // break from _.forEach
                return false;
            }

            // remap the data
            var cleanedData = _.map(data.points, function(data) {
                switch(vm.type) {
                    case 'time':
                        return  {x: parseTime(data.x), y: +data.y};
                    case 'date':
                        return  {x: parseDate(data.x), y: +data.y};
                    default:
                        throw 'Invalid Type ' + vm.type;
                }
            });

            // use the provided name to label the data series, otherwise use the index
            var label;
            if (data.name) {
                label = data.name;
            } else {
                label = 'i: ' + index;
            }

            // Add the valueline path.
            vm.svg.append('path')
                .attr('class', 'line')
                .attr('stroke', vm.colors(label))
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

        // draw the legend, if specified
        if (vm.showLegend) {
            var legendRectSize = 14;
            var legendSpacing = 2;
            var maximumLegendOffset = 20;
            var legendBeginningOffsetPercentage = 0.2;

            /**
             * Select the legend, select the domain of colors created earlier in the path fill function. Give each
             * 'g' element a legend class. Then center the legend based on the size of the chart. The color domain
             * is an array of all names defined in the fill function.
             */
            var legend = vm.svg.selectAll('.legend')
                .data(vm.colors.domain())
                .enter()
                .append('g')
                .attr('class', 'legend')
                .attr('transform', function (data, index) {
                    var legendHeight = vm.graphHeight;
                    var offset = legendHeight / vm.colors.domain().length;
                    // with few elements, we don't want the vertical spacing to be too large
                    offset = Math.min(maximumLegendOffset, offset);
                    var horizontalPosition = vm.graphWidth + vm.legendWidth * legendBeginningOffsetPercentage ;
                    var verticalPosition = (index + 1) * offset;
                    return 'translate(' + horizontalPosition + ',' + verticalPosition + ')';
                });

            /**
             * Add the legend squares to the chart
             */
            legend.append('rect')
                .attr('width', legendRectSize)
                .attr('height', legendRectSize)
                .style('fill', vm.colors)
                .style('stroke', vm.colors);

            /**
             * Add the legend test to the chart
             */
            legend.append('text')
                .attr('x', legendRectSize + legendSpacing)
                .attr('y', legendRectSize - legendSpacing)
                .text(function (d) {
                    return d;
                });
        }
    };

    /**
     * draws + redraws the time graph.
     */
    D3TimeGraphDirectiveCtrl.prototype.redraw = function() {
        var vm = this;

        // Set the dimensions of the canvas / graph.
        var size = vm.getSize();

        vm.graphWidth = size.width - MARGINS.left - MARGINS.right;
        vm.graphHeight = size.height - MARGINS.top - MARGINS.bottom;

        // determine if we're adding a legend
        if (vm.showLegend) {
            // set aside a portion of the graph space for the legend
            vm.legendWidth = LEGEND_WIDTH_PERCENT * 0.01 * vm.graphWidth;
            vm.graphWidth -= vm.legendWidth;
        }

        // Adds/Replaces the SVG canvas
        var oldSvg = vm.svgDiv.select('svg');
        if(oldSvg) {
            oldSvg.remove();
        }
        vm.svg = vm.svgDiv
            .append('svg')
            .attr('width', size.width)
            .attr('height', size.height)
            .append('g')
            .attr('transform',
                'translate(' + MARGINS.left + ',' + MARGINS.top + ')');

        vm.colors = d3.scaleOrdinal(LINE_COLORS);

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
