import * as d3 from 'd3-selection';
import * as d3transition from 'd3-transition';
import { gup } from 'd3-gup';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { csv } from 'd3-fetch';
import { extent } from "d3-array";
import { line, symbol as circle } from "d3-shape";
import { axes, axesPositionBottom, axesGrid, axesShape as shape, axesSymbol as symbol } from 'd3-axes';
import { compose } from 'd3-compose';
import { wrap } from 'd3-wrap';

//import 'put-selector';
//put.addNamespace('svg', d3.namespaces.svg);

function guard(context, runner) {
  let selection;
  if (context.selection) {
    selection = runner(context.selection());
    if (selection.transition) {
      return selection.transition(context);
    }
  } else {
    selection = runner(context);
  }
  return selection;
}

function wrapSelection(context, selector) {
  let wrapped = context.select(selector);
  if (!wrapped.size()) {
    let [ tag, className ] = selector.split('.', 2);
    wrapped = guard(context, $ => $.append(tag)
      .attr('class', className));
  }
  return wrapped;
}

let x = d => +d.t
  , y = d => +d.v
  , xAxis = axisBottom().scale(scaleLinear())
  , yAxis = axisLeft().scale(scaleLinear())
  , curve = shape(line().x(x).y(y))
  , icons = symbol(circle().size(36))
  , yLabel = gup()
      .enter($ => $
        .append('text')
        .attr('class', 'label'))
      .post(($, offset, text) => $
        .attr('transform', 'rotate(-90)')
        .attr('y', offset)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text(text))([null])
  , grid = (axis, name) => wrap(
      axesGrid(axis),
      (grid, $, refAxis) => grid(wrapSelection($, `g.${name}`), refAxis))
  , plot = wrap(
      wrap(
        axes(
          compose(axesPositionBottom, xAxis)
        , compose(
            ($ => $.selectAll('.label').call(yLabel, 6, 'Velocity')),
            yAxis,
            grid(yAxis, 'major'),
            grid(yAxis, 'minor').ticks(50)
          )
        )
        .padding(20, 20, 30, 50)
        .width(document.documentElement.clientWidth)
        .height(500)
        .domain([0.01,0.03], [-0.002,0.002])
      , curve
      )
    , icons
    )
  ;

icons.path().x(x).y(y);

let svg = d3.select("svg")
      .classed("loading", true)
      .attr("width", plot.width())
      .attr("height", plot.height());

plot(svg);

csv("data.csv").then(data => {
  icons.data(data);
  curve.data([data]);
  plot(svg);
  plot.domain(
    extent(data, x),
    extent(data, y)
  );

  svg.transition().duration(900)
      .on('end', () => svg.classed("loading", false))
      .call(plot);
});
