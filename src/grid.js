import { gup } from 'd3-gup';
import { closestClassed } from './closest';

const epsilon = 1e-6;

function center(scale) {
  var offset = scale.bandwidth() / 2;
  if (scale.round()) offset = Math.round(offset);
  return function(d) {
    return scale(d) + offset;
  };
}

function identity(scale) {
  return scale;
}

export function grid(basis) {
  let tickValues = null
    , tickArguments = null
    ;
  function grid(context, axis) {
    let selection = context.selection ? context.selection() : context
      , scale = basis.scale()
      , values = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments || basis.tickArguments()) : scale.domain()) : tickValues
      , range = axis.scale().range()
      , size = range[1] - range[0]
      , [x, y] = closestClassed(selection, 'axis').classed("y")
        ? ["x", "y"]
        : ["y", "x"]
      , position = (range = basis.scale().range(), scale.bandwidth ? center : identity)(scale.copy().range([range[0] + 0.5, range[1] + 0.5]))
      , line = gup()
          .pre($ => ($.selection ? $.selection() : $).order())
          .exit($ => $.attr("opacity", epsilon)
            .attr(x + "2", size)
            .attr(y + "1", function(d) { return position(d); })
            .attr(y + "2", function(d) { return position(d); })
            .remove())
          .enter($ => $.append("line")
            .attr("class", "grid")
            .attr("opacity", epsilon)
            .attr(x + "2", size)
            .attr(y + "1", function(d) { return (this.parentNode.__grid || position)(d); })
            .attr(y + "2", function(d) { return (this.parentNode.__grid || position)(d); }))
          .post($ => $.attr("opacity", 1)
            .attr(x + "2", size)
            .attr(y + "1", position)
            .attr(y + "2", position))
    ;
    selection.selectAll(".grid").call(line, values, scale)
      .each(function() { this.__grid = position; });
  }

  grid.ticks = function(...args) {
    return tickArguments = args, grid;
  };

  grid.tickArguments = function(_) {
    return arguments.length ? (tickArguments = _ == null ? [] : slice.call(_), grid) : tickArguments.slice();
  };

  grid.tickValues = function(_) {
    return arguments.length ? (tickValues = _ == null ? null : slice.call(_), grid) : tickValues && tickValues.slice();
  };

  return grid;
}

