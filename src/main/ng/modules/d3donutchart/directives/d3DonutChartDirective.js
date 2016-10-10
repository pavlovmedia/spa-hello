(function () {
    /**
     * generates the tables shown in the import pages
     */

    var d3 = require('d3');

    var d3DonutChartDirective = function () {
        return {
            restrict: 'E',
            controller: 'D3DonutChartDirectiveCtrl as vm',
            templateUrl: 'd3donutchart/templates/d3-donut-chart-directive.html',
            scope: {
                data: '=',
                totalSize: '='
            },

            link: function (scope, element) {

                // Set the set of the legend squares and spacing between
                var legendRectSize = 18;
                var legendSpacing = 4;
                var selector = d3.select(element[0]).select('div > div .donut');
                var radiusScale = 0.4;
                var debounceTime = 50;

                /**
                 * Sets a debounce so the graph doesn't get updated to many times in a row
                 */
                var debouncedRedraw = _.debounce(function() {
                    buildChart(scope.data);
                }, debounceTime);

                /**
                 * Looks for a svg element, if it's present then delete it
                 */
                var removeOldChart =  function () {
                    var oldSvg = selector.select('svg');
                    if(oldSvg) {
                        oldSvg.remove();
                    }
                };

                var buildChart = function () {

                    // check for an older chart and remove
                    removeOldChart();

                    /**
                     * Select the initial object and append the svg object to it. Set the width and height of the chart.
                     * Center the 'g' element to the center of the circle.
                     */
                    var svg = selector
                        .append('svg')
                        .attr('width', scope.totalSize * 2)
                        .attr('height', scope.totalSize)
                        .append('g')
                        .attr('transform', 'translate(' + (scope.totalSize / 2) + ',' + (scope.totalSize / 2) + ')');

                    /**
                     * Set the color scheme, using d3's category 20b scheme currently though this can be customized with an
                     * array of colors to include hexadecimal codes
                     */
                    var color = d3.scaleOrdinal(d3.schemeCategory20b);

                    // Set the radius of the chart
                    var radius = scope.totalSize / 2;

                    // Set the radius of the donut hole
                    var donutWidth = radius * radiusScale;

                    /**
                     * Set the inner and outer radius of the chart
                     */
                    var arc = d3.arc()
                        .innerRadius(radius - donutWidth)
                        .outerRadius(radius);

                    /**
                     * Extract the numerical data from each entry, don't sort (default is to sort) order will be defined
                     * by the order we put in the data
                     * @type {*|Array.<T>} The extracted data used to build the chart
                     */
                    var pie = d3.pie()
                        .value(function (extractedData) {
                            return extractedData.value;
                        })
                        .sort(null);

                    /**
                     * Build the donut chart by passing the data through the pie function, thus extracting it, Next set the
                     * 'd' attribute through the arc function. Finally fill in the colors by binding them to the names and
                     * using the colors set that were defined (currently using and ordinal set of colors). ExtractedData
                     * is built by d3 in order to build the arc. The original data object is stored within data
                     */
                    var path = svg.selectAll('path')
                        .data(pie(scope.data))
                        .enter()
                        .append('path')
                        .attr('d', arc)
                        .attr('fill', function (extractedData) {
                            return color(extractedData.data.name);
                        });

                    /**
                     * Select the legend, select the domain of colors created earlier in the path fill function. Give each
                     * 'g' element a legend class. Then center the legend based on the size of the chart. The color domain
                     * is an array of all names defined in the fill function.
                     */
                    var legend = svg.selectAll('.legend')
                        .data(color.domain())
                        .enter()
                        .append('g')
                        .attr('class', 'legend')
                        .attr('transform', function (data, index) {
                            var legendHeight = legendRectSize + legendSpacing;
                            var offset = legendHeight * color.domain().length / 2;
                            var horizontalPosition = scope.totalSize - (scope.totalSize * 0.4);
                            var verticalPosition = index * legendHeight - offset;
                            return 'translate(' + horizontalPosition + ',' + verticalPosition + ')';
                        });

                    /**
                     * Add the legend squares to the chart
                     */
                    legend.append('rect')
                        .attr('width', legendRectSize)
                        .attr('height', legendRectSize)
                        .style('fill', color)
                        .style('stroke', color);

                    /**
                     * Add the legend test to the chart
                     */
                    legend.append('text')
                        .attr('x', legendRectSize + legendSpacing)
                        .attr('y', legendRectSize - legendSpacing)
                        .text(function (d) {
                            return d;
                        });
                };
                
                buildChart();

                /**
                 * Update chart if data updates
                 */
                scope.$watch('data', function() {
                    debouncedRedraw();
                }, true);

                /**
                 * Update chart if the total size of the chart changes
                 */
                scope.$watch('totalSize', function() {
                    debouncedRedraw();
                }, true);

            }
        };
    };

    var app = require('angular').module('swf.ng.app');
    app.directive('d3DonutChartDirective', d3DonutChartDirective);
})();