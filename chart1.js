// Set the dimensions of the canvas / graph
var chart1margin = {top: 30, right: 20, bottom: 30, left: 50},
    chart1width = 870 - chart1margin.left - chart1margin.right,
    chart1height = 600 - chart1margin.top - chart1margin.bottom;

// Set the ranges
var chart1x = d3.scale.ordinal().rangeRoundBands([0, chart1width],0.15);
var chart1y = d3.scale.linear().range([chart1height, 0]);

// Define the axes
var chart1xAxis = d3.svg.axis().scale(chart1x).tickFormat("");

var chart1yAxis = d3.svg.axis().scale(chart1y)
    .orient("left").ticks(9);

// Adds the svg canvas
var chart1 = d3.select("div#chart1")
    .append("svg")
        .attr("width", chart1width + chart1margin.left + chart1margin.right)
        .attr("height", chart1height + chart1margin.top + chart1margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + chart1margin.left + "," + chart1margin.top + ")");

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("display", "none");

// Get the data
d3.csv("spreads.csv", function(error, data) {

    // Scale the range of the data
    chart1x.domain(data.map(function(d) { return d.index; }));
    chart1y.domain([-35,35]);

    // Add the X Axis
    chart1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + chart1height/2 + ")")
        .call(chart1xAxis);

    chart1.selectAll("line.horizontalGrid").data(chart1y.ticks(7)).enter()
    .append("line")
        .attr(
        {
            "class":"horizontalGrid",
            "x1" : '0',
            "x2" : chart1width,
            "y1" : function(d){ return chart1y(d);},
            "y2" : function(d){ return chart1y(d);},
            "fill" : "none",
            "shape-rendering" : "crispEdges",
            "stroke" : "#919191",
            "stroke-dasharray" : "5,5",
            "stroke-width" : "1px"
        });

    // Add the Y Axis
    chart1.append("g")
        .attr("class", "y axis")
        .call(chart1yAxis)
      .append('text')
        .attr("y", 6)
        .attr("dx", ".71em")
        .style("text-anchor", "start")
        .text("Beating Trump");

    chart1.select('g.y').append('text')
        .attr("y", 6)
        .attr("dx", ".71em")
        .attr('dy', chart1height)
        .style("text-anchor", "start")
        .text("Losing to Trump");

    chart1.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", function(d) { return "bar bar-" + (d.Sanders_up < 0 ? "negative" : "positive"); })
        .attr("x", function(d) { return chart1x(d.index); })
        .attr("width", chart1x.rangeBand())
        .attr("y", function(d) {
          if (chart1y(d.Sanders) < chart1y(d.Clinton)) {
            return chart1y(d.Sanders);
          } else {return chart1y(d.Clinton);}
        })
        .attr("height", function(d) { return Math.abs(chart1y(d.Sanders) - chart1y(d.Clinton))})
        .on("mouseover", function(d) {
              div.transition()
                  .duration(200)
                  .style("opacity", .9);
              div	.html(d.date + ", " + d.poll + "<br />" + d.area + " Poll<br />Clinton: " + (d.Clinton*1).toFixed(0) + "<br />Sanders: " + (d.Sanders*1).toFixed(0))
                  .style("left", (d3.event.pageX + 10) + "px")
                  .style("top", (d3.event.pageY - 30) + "px")
                  .style('display', 'inline');
              })
        .on('mousemove', function(d) {
            div
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 30) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
        });
        ;

    chart1.selectAll(".tick1")
        .data(data)
      .enter().append("rect")
        .attr("x", function(d) { return chart1x(d.index); })
        .attr("width", chart1x.rangeBand())
        .attr('class', 'tick1')
        .attr("y", function(d) { return chart1y(d.Clinton); })
        .attr("height", 2);

    var label1 = chart1.selectAll('.c-box')
        .data(data)
      .enter().append('g')
        .attr('class','c-box')
        .attr('transform', function(d) { return 'translate(' + (chart1x(d.index) + chart1x.rangeBand()/4) + ',' + (chart1y(d.Clinton) - chart1x.rangeBand()/4) + ')'});

    label1.append('rect')
        .attr('width', chart1x.rangeBand()/2)
        .attr('height', chart1x.rangeBand()/2);

    label1.append('text')
        .attr('dx',chart1x.rangeBand()/4)
        .attr('dy','9')
        .style("text-anchor", "middle")
        .style('font-size',chart1x.rangeBand()/2)
        .text('C');

    chart1.selectAll(".tick2")
        .data(data)
      .enter().append("rect")
        .attr("x", function(d) { return chart1x(d.index); })
        .attr("width", chart1x.rangeBand())
        .attr('class', 'tick2')
        .attr("y", function(d) { return chart1y(d.Sanders); })
        .attr("height", 2);

    var label2 = chart1.selectAll('.s-box')
        .data(data)
      .enter().append('g')
        .attr('class','s-box')
        .attr('transform', function(d) { return 'translate(' + (chart1x(d.index) + chart1x.rangeBand()/4) + ',' + (chart1y(d.Sanders) - chart1x.rangeBand()/4) + ')'});

    label2.append('rect')
        .attr('width', chart1x.rangeBand()/2)
        .attr('height', chart1x.rangeBand()/2);

    label2.append('text')
        .attr('dx',chart1x.rangeBand()/4)
        .attr('dy','9')
        .style("text-anchor", "middle")
        .style('font-size',chart1x.rangeBand()/2)
        .text('S');

});
