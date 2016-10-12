(function () {

    var d3 = require('d3');
    var $ = require('jquery');

    /**
     * generates the tables shown in the import pages
     */
    var d3BarChartDirective = function () {
        return {
            restrict: 'E',
            controller: 'D3BarChartDirectiveCtrl as vm',
            templateUrl: 'd3barchart/templates/d3-bar-chart-directive.html',
            scope: {
                data: '=',
                vertical: '=',
                barsAllowed: '=',
                height: '=',
                width: '=',
                setManually: '='
            },
            link: function (scope, element) {

                var margin = {top: 20, right: 20, bottom: 30, left: 40};
                var width = scope.width - margin.left - margin.right;
                var height = scope.height - margin.top - margin.bottom;
                var svg = undefined;
                var selector = d3.select(element[0]).select('div > div .graphRegion');
                var debounceTime = 50;

                /**
                 * Sets a debounce so the graph doesn't get updated to many times in a row
                 */
                var debouncedRedraw = _.debounce(function() {
                    buildTable(scope.data);
                }, debounceTime);

                /**
                 * removes and rebuilds the graph
                 */
                function buildTable() {
                    var onlyActive = [];

                    _.forEach(scope.data, function (data, index) {

                        if(index + 1 > scope.barsAllowed) {
                            return false;
                        }

                        if (data.active) {
                            onlyActive.push(data);
                        }
                    });

                    var oldSvg = selector.select('svg');
                    if(oldSvg) {
                        oldSvg.remove();
                    }

                    if (scope.vertical) {
                        buildVerticalBarGraph(onlyActive);
                    } else {
                        buildHorizontalBarGraph(onlyActive);
                    }
                }

                /**
                 * Watch the data object for changes then remove and rebuild the graph
                 */
                scope.$watch('data', function () {
                    debouncedRedraw();
                }, true);

                /**
                 * Watch vertical changes then remove and rebuild the graph
                 */
                scope.$watch('vertical', function () {
                    debouncedRedraw();
                }, true);

                /**
                 * Watch vertical changes then remove and rebuild the graph
                 */
                scope.$watch('barsAllowed', function () {
                    debouncedRedraw();
                }, true);

                /**
                 * Watch element height and width changes then remove and rebuild the graph
                 */
                scope.$watch(function () {
                    return $(element[0]).height() + $(element[0]).width();
                }, function () {
                    if (scope.setManually) {
                        return;
                    }
                    scope.width = $(element[0]).width();
                    debouncedRedraw();
                });

                /**
                 * Watch height and width changes then remove and rebuild the graph
                 */
                scope.$watch(function () {
                    return scope.height + scope.width;
                }, function () {
                    if (!scope.setManually) {
                        return;
                    }
                    debouncedRedraw();
                });

                /**
                 * Append the graph to the element
                 */
                var createSvg = function () {
                    svg = selector.append('svg')
                        .attr('width', scope.width + margin.left + margin.right)
                        .attr('height', scope.height + margin.top + margin.bottom)
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
                    var x = d3.scaleBand().range([0, scope.width - 20]).padding(0.1);
                    var y = d3.scaleLinear().range([scope.height, 0]);

                    /**
                     * Adds up all data in order to scale the graph
                     */
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
                            return scope.height - y(data.value);
                        })
                        .style('fill', function (data) {
                            return data.color
                        });

                    /**
                     * add the x Axis
                     */
                    svg.append('g').attr('transform', 'translate(0,' + scope.height + ')')
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
                    var barHeight = (scope.height - axisMargin - margin.top * 2) * 0.4 / graphData.length;
                    var barPadding = (scope.height - axisMargin - margin.right * 2) * 0.6 / graphData.length;
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
                        .range([0, (scope.width - margin.right * 2 - labelWidth) - 100]);

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
                        .attr('transform', 'translate(' + (margin.right + labelWidth) + ',' + (scope.height - axisMargin - margin.right) + ')')
                        .call(d3.axisBottom(scale));
                };

                buildTable(scope.data);
            }
        };
    };

    var app = require('angular').module('swf.ng.app');
    app.directive('d3BarChartDirective', d3BarChartDirective);
})();