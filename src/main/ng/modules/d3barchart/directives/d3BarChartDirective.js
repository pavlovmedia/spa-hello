(function () {
    /**
     * generates the tables shown in the import pages
     */

    var d3 = require('d3');
    var $ = require('jquery');

    var d3BarChartDirective = function () {
        return {
            restrict: 'E',
            controller: 'D3BarChartDirectiveCtrl as vm',
            templateUrl: 'd3barchart/templates/d3-bar-chart-directive.html',
            scope: {
                data: '=',
                vertical: '=',
                barsAllowed: '=',
                heightAndWidth: '='
            },
            link: function (scope, element) {

                var margin = {top: 20, right: 20, bottom: 30, left: 40};
                var width = scope.heightAndWidth.width - margin.left - margin.right;
                var height = scope.heightAndWidth.height - margin.top - margin.bottom;
                var svg = undefined;

                /**
                 * removes and rebuilds the graph
                 */
                function buildTable() {
                    var onlyActive = [];
                    var finalArray = [];

                    _.forEach(scope.data, function (data) {
                        if (data.active) {
                            onlyActive.push(data);
                        }
                    });

                    for (var i = 0; i < scope.barsAllowed; i++) {

                        if (!onlyActive[i]) {
                            break;
                        }

                        finalArray.push(onlyActive[i]);
                    }

                    d3.select('svg').remove();

                    if (scope.vertical) {
                        buildVerticalBarGraph(finalArray);
                    } else {
                        buildHorizontalBarGraph(finalArray);
                    }
                }

                /**
                 * Watch the data object for changes then remove and rebuild the graph
                 */
                scope.$watch('data', function () {
                    buildTable();
                }, true);

                /**
                 * Watch vertical changes then remove and rebuild the graph
                 */
                scope.$watch('vertical', function () {
                    buildTable();
                }, true);

                /**
                 * Watch vertical changes then remove and rebuild the graph
                 */
                scope.$watch('barsAllowed', function () {
                    buildTable();
                }, true);

                /**
                 * Watch height and width  changes then remove and rebuild the graph
                 */
                scope.$watch(function () {
                    return $(element[0]).height() + $(element[0]).width();
                }, function (newValue) {
                    scope.width = newValue.w;
                    buildTable();
                }, true);

                /**
                 * Append the graph to the element
                 */
                var createSvg = function () {
                    svg = d3.select('#testId').append('svg')
                        .attr('width', scope.heightAndWidth.width + margin.left + margin.right)
                        .attr('height', scope.heightAndWidth.height + margin.top + margin.bottom)
                        .append('g')
                        .attr('transform',
                            'translate(' + margin.left + ',' + margin.top + ')');
                };

                /**
                 * Build the graph
                 * @param graphData The data used to build the graph
                 */
                var buildVerticalBarGraph = function (graphData) {
                    createSvg();

                    /**
                     * set ranges
                     */
                    var x = d3.scaleBand().range([0, scope.heightAndWidth.width - 20]).padding(0.1);
                    var y = d3.scaleLinear().range([scope.heightAndWidth.height, 0]);

                    _.forEach(graphData, function (data) {
                        data.value = +data.value;
                    });

                    /**
                     * Scale the range of the data in the domains
                     */
                    x.domain(graphData.map(function (data) {
                        return data.name;
                    }));

                    y.domain([0, d3.max(graphData, function (data) {
                        return data.value;
                    })]);

                    /**
                     * append the rectangles to the chart
                     */
                    svg.selectAll('.bar')
                        .data(graphData)
                        .enter().append('rect')
                        .attr('class', 'bar')
                        .attr('x', function (data) {
                            return x(data.name);
                        })
                        .attr('width', x.bandwidth())
                        .attr('y', function (data) {
                            return y(data.value);
                        })
                        .attr('height', function (data) {
                            return scope.heightAndWidth.height - y(data.value);
                        })
                        .style('fill', function (data) {
                            return data.color
                        });

                    /**
                     * add the x Axis
                     */
                    svg.append('g').attr('transform', 'translate(0,' + scope.heightAndWidth.height + ')')
                        .call(d3.axisBottom(x));

                    /**
                     * add the y Axis
                     */
                    svg.append('g')
                        .call(d3.axisLeft(y));
                };

                /**
                 *
                 * @param graphData data that builds the table
                 */
                var buildHorizontalBarGraph = function (graphData) {
                    createSvg();

                    var axisMargin = 20;
                    var barHeight = (scope.heightAndWidth.height - axisMargin - margin.top * 2) * 0.4 / graphData.length;
                    var barPadding = (scope.heightAndWidth.height - axisMargin - margin.right * 2) * 0.6 / graphData.length;
                    var labelWidth = 0;

                    var max = d3.max(graphData, function (data) {
                        return data.value;
                    });

                    var bar = svg.selectAll('g')
                        .data(graphData)
                        .enter()
                        .append('g');

                    var scale = d3.scaleLinear()
                        .domain([0, max])
                        .range([0, (scope.heightAndWidth.width - margin.right * 2 - labelWidth) - 100]);

                    bar.attr('class', 'bar')
                        .attr('cx', 0)
                        .attr('transform', function (d, i) {
                            return 'translate(' + margin.right + ',' + (i * (barHeight + barPadding)) + ')';
                        });

                    bar.append('text')
                        .attr('class', 'label')
                        .attr('y', barHeight / 2)
                        .attr('dy', '.35em')
                        .text(function (data) {
                            return data.name;
                        })
                        .each(function () {
                            labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
                        });

                    bar.append('rect')
                        .attr('transform', 'translate(' + labelWidth + ', 0)')
                        .attr('height', barHeight)
                        .attr('width', function (data) {
                            return scale(data.value);
                        })
                        .style('fill', function (data) {
                            return data.color;
                        });

                    svg.append('g')
                        .attr('transform', 'translate(' + (margin.right + labelWidth) + ',' + (scope.heightAndWidth.height - axisMargin - margin.right) + ')')
                        .call(d3.axisBottom(scale));
                };

                buildTable(scope.data);
            }
        };
    };

    var app = require('angular').module('swf.ng.app');
    app.directive('d3BarChartDirective', d3BarChartDirective);
})();