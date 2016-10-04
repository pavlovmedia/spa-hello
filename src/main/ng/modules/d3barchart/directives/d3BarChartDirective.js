(function () {
    /**
     * generates the tables shown in the import pages
     */

    var d3 = require('d3');

    var d3BarChartDirective = function () {
        return {
            restrict: 'E',
            controller: 'D3BarChartDirectiveCtrl as vm',
            scope: {
                data: '=',
                vertical: '=',
                barsAllowed: '='
            },
            link: function (scope, element) {

                scope.$watchCollection(function() {return scope.data;}, function(newData, oldData) {
                    if(angular.equals(newData, oldData)) {
                        return;
                    }

                    d3.select('svg').remove();
                    buildBarGraph(newData);

                });

                var buildBarGraph = function(data) {
                    var margin = {top: 20, right: 20, bottom: 30, left: 40},
                        width = 960 - margin.left - margin.right,
                        height = 500 - margin.top - margin.bottom;

                    // set the ranges
                    var x = d3.scaleBand()
                        .range([0, width])
                        .padding(0.1);
                    var y = d3.scaleLinear()
                        .range([height, 0]);

                    // append the svg object to the body of the page
                    // append a 'group' element to 'svg'
                    // moves the 'group' element to the top left margin
                    var svg = d3.select(element[0]).append('svg')
                        .attr('width', width + margin.left + margin.right)
                        .attr('height', height + margin.top + margin.bottom)
                        .append('g')
                        .attr('transform',
                            'translate(' + margin.left + ',' + margin.top + ')');

                    // format the data
                    data.forEach(function (d) {
                        d.value = +d.value;
                    });

                    // Scale the range of the data in the domains
                    x.domain(data.map(function (d) {
                        return d.name;
                    }));
                    y.domain([0, d3.max(data, function (d) {
                        return d.value;
                    })]);

                    // append the rectangles for the bar chart
                    svg.selectAll('.bar')
                        .data(data)
                        .enter().append('rect')
                        .attr('class', 'bar')
                        .attr('x', function (d) {
                            return x(d.name);
                        })
                        .attr('width', x.bandwidth())
                        .attr('y', function (d) {
                            return y(d.value);
                        })
                        .attr('height', function (d) {
                            return height - y(d.value);
                        })
                        .style('fill', function(d) {return d.color});

                    // add the x Axis
                    svg.append('g')
                        .attr('transform', 'translate(0,' + height + ')')
                        .call(d3.axisBottom(x));

                    // add the y Axis
                    svg.append('g')
                        .call(d3.axisLeft(y));
                };

                buildBarGraph(scope.data);

            }
        };
    };

    var app = require('angular').module('swf.ng.app');
    app.directive('d3BarChartDirective', d3BarChartDirective);
})();