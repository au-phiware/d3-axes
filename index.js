import * as d3 from 'd3-selection';
import * as d3transition from 'd3-transition';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { csv } from 'd3-request';
import { extent } from "d3-array";
import { line } from "d3-shape";
import { axes, axesPositionBottom, axesGrid } from 'd3-axes';
import { compose } from 'd3-compose';

let x = d => +d.t
  , y = d => +d.v
  , xAxis = axisBottom().scale(scaleLinear())
  , yAxis = axisLeft().scale(scaleLinear())
  , plot = axes(
        compose(axesPositionBottom, xAxis),
        compose(function(selection) {
          let label = selection.select('.label');
          
          if (!label.size()) {
            label = selection.append('text')
              .attr('class', 'label');
          }
          label
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Velocity');
        }, yAxis, axesGrid(yAxis))
      )
      .padding(20, 20, 30, 50)
      .width(document.documentElement.clientWidth)
      .height(500)
      .domain([0,0.1], [-0.01,0.01])
  , curve = line()
    .x(d => plot.x().scale()(x(d)))
    .y(d => plot.y().scale()(y(d)));


let svg = d3.select("svg")
      .attr("width", plot.width())
      .attr("height", plot.height());

plot(svg);

csv("data.csv", (error, data) => {
  if (!data) throw error;

  plot.domain(
    extent(data, x),
    extent(data, y)
  );

  let curves = svg.transition().duration(900)
      .call(plot)
      .select('.axes')
      .selectAll('.curve').selection()
      .data([data]);

  curves.exit().remove();

  curves.enter()
      .append('path')
      .attr('class', 'curve')
    .merge(curves)
      .attr('d', curve);
});
