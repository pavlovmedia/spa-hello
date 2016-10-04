(function() {
    var d3 = require('d3');

    var lineColors = [
        '#7fc97f','#beaed4','#fdc086','#ffff99','#386cb0',
        '#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e',
        '#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99',
        '#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00',
        '#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3',
        '#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854'
    ];

    /**
     * @type {number} The maximum allowed data series in the graph.
     */
    var MAX_ALLOWED_DATA_SERIES = 30;

    /**
     * @constructor
     * @see http://bl.ocks.org/d3noob/b3ff6ae1c120eea654b5
     */
    function D3TimeGraphDirectiveCtrl($element, $scope, $log) {
        'ngInject';

        var vm = this;

        // Hold on to service references
        vm.log = $log;
        vm.scope = $scope;
        vm.element = $element[0];

        // TODO move function outside
        vm.scope.$watch(function() { return vm.sourceData; }, function(newData) {
            vm.log.info('sourceData changed', newData);
            vm.drawGraph();
        }, true);
    }

    D3TimeGraphDirectiveCtrl.prototype.drawGraph = function() {
        var vm = this;

        // Set the dimensions of the canvas / graph
        var margin = {top: 30, right: 20, bottom: 60, left: 50},
            width = 600 - margin.left - margin.right,
            height = 270 - margin.top - margin.bottom;

        // Parse the date / time
        var parseDate = d3.timeParse('%Y-%m-%d');

        // Set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // Define the axes
        var xAxis = d3.axisBottom(x);

        var yAxis = d3.axisLeft(y);

        // Define the line
        var valueLine = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.close); });

        // Adds/Replaces the SVG canvas
        var oldSvg = d3.select(vm.element).select('svg');
        if(oldSvg) {
            oldSvg.remove();
        }
        var svg = d3.select(vm.element)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform',
                'translate(' + margin.left + ',' + margin.top + ')');

        // Scale the range of the data
        // y.domain([0, d3.max(cleanedData, function(d) { return d.close; })]);

        y.domain([
            d3.min(vm.sourceData, function(c) { return d3.min(c, function(d) { return d.y; }); }),
            d3.max(vm.sourceData, function(c) { return d3.max(c, function(d) { return d.y; }); })
        ]);

        _.forEach(vm.sourceData, function(data, index) {
            // remap the data
            var cleanedData = _.map(data, function(d) {
                return  {date: parseDate(d.x), close: +d.y};
            });

            x.domain(d3.extent(cleanedData, function(d) { return d.date; }));

            // Add the valueline path.
            svg.append('path')
                .attr('class', 'line')
                .attr('stroke', lineColors[index])
                .attr('stroke-width', 2)
                .attr('fill', 'none')
                .attr('d', valueLine(cleanedData));
        });

        // Add the X Axis
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        // Add the Y Axis
        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis);
    };

    var app = require('angular').module('swf.ng.app');
    app.controller('D3TimeGraphDirectiveCtrl', D3TimeGraphDirectiveCtrl);
})();
