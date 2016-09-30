(function() {
    var d3 = require('d3');

    /**
     * @constructor
     * @see http://bl.ocks.org/d3noob/b3ff6ae1c120eea654b5
     */
    function D3TimeGraphDirectiveCtrl($element) {
        'ngInject';

        // Set the dimensions of the canvas / graph
        var margin = {top: 30, right: 20, bottom: 30, left: 50},
            width = 600 - margin.left - margin.right,
            height = 270 - margin.top - margin.bottom;

        // Parse the date / time
        var parseDate = d3.timeParse("%d-%b-%y");

        // Set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // Define the axes
        var xAxis = d3.axisBottom(x)
            .ticks(5);

        var yAxis = d3.axisLeft(y)
            .ticks(5);

        // Define the line
        var valueline = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.close); });

        // Adds the svg canvas
        var svg = d3.select(".myBarDirective")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var data = [
                "1-May-12,58.13",
                "30-Apr-12,53.98",
                "27-Apr-12,67.00",
                "26-Apr-12,89.70",
                "25-Apr-12,99.00",
                "24-Apr-12,130.28",
                "23-Apr-12,166.70",
                "20-Apr-12,234.98",
                "19-Apr-12,345.44",
                "18-Apr-12,443.34",
                "17-Apr-12,543.70",
                "16-Apr-12,580.13",
                "13-Apr-12,605.23",
                "12-Apr-12,622.77",
                "11-Apr-12,626.20",
                "10-Apr-12,628.44",
                "9-Apr-12,636.23",
                "5-Apr-12,633.68",
                "4-Apr-12,624.31",
                "3-Apr-12,629.32",
                "2-Apr-12,618.63",
                "30-Mar-12,599.55",
                "29-Mar-12,609.86",
                "28-Mar-12,617.62",
                "27-Mar-12,614.48",
                "26-Mar-12,606.98"
            ];

        // Get the data
        data = _.map(data, function(d) {
            var data = d.split(",");
            return  {date: parseDate(data[0]), close: +data[1]};
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.close; })]);

        // Add the valueline path.
        svg.append("path")
            .attr("class", "line")
            .attr("d", valueline(data));

        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
    }

    var app = require('angular').module('swf.ng.app');
    app.controller('D3TimeGraphDirectiveCtrl', D3TimeGraphDirectiveCtrl);
})();
