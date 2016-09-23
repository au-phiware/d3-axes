import * as d3 from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { line } from 'd3-shape';
import { csv } from 'd3-request';
import { extent } from 'd3-array';

let margin = {top: 20, right: 20, bottom: 30, left: 50};
let width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

let x = scaleLinear().range([0, width]),
    y = scaleLinear().range([height, 0]);

let xAxis = axisBottom().scale(x),
    yAxis = axisLeft().scale(y);

let curve = line()
        .x(d => x(+d.t))
        .y(d => y(+d.v));

let svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

csv("data.csv", (error, data) => {
    if (!data) throw error;

    x.domain(extent(data, d => +d.t));
    y.domain(extent(data, d => +d.v));

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);

    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
    .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Velocity');

    svg.append('path')
        .datum(data)
        .attr('class', 'curve')
        .attr('d', curve);
});
