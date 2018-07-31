import { local } from 'd3-selection';
import { gup } from 'd3-gup';
import { closestClassed } from './closest';

const slice = Array.prototype.slice;

function center(scale) {
  var offset = scale.bandwidth() / 2;
  if (scale.round()) offset = Math.round(offset);
  return function(d) {
    return scale(d) + offset;
  };
}

function gridLine(x, y, size, pos, opacity, next) {
  return $ => $.attr("opacity", opacity)
    .attr(x + "2", size)
    .call(next ? $ => $.each(function() { pos.set(this, next) }) : $=>$)
    .attr(y + "1", function(d) { return pos.get(this)(d) })
    .attr(y + "2", function(d) { return pos.get(this)(d) })
}

export function grid(basis) {
  const position = local();

  let tickValues = null
    , tickArguments = null
    , line = gup()
        .select($ => $.selectAll(".grid"))
        .pre($ => ($.selection ? $.selection() : $)
          .order())
        .exit(($, x, y, size, position, p) => $
          .call(gridLine(x, y, size, position, 0, p))
          .remove())
        .enter(($, x, y, size, position, p) => $
          .append("line")
          .attr("class", "grid")
          .call(gridLine(x, y, size, position, 0)))
        .post(($, x, y, size, position, p) => $
          .call(gridLine(x, y, size, position, 1, p)))
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
    ;
    range = basis.scale().range();
    var p = scale.copy().range([range[0] + 0.5, range[1] + 0.5]);
    if (scale.bandwidth) p = center(p);
    if (!position.get(context.node())) {
      position.set(context.node(), p);
    }
    context
      .call(line(values, scale), x, y, size, position, p);
    position.set(context.node(), p);
  }

  grid.ticks = function(...args) {
    return tickArguments = args, this;
  };

  grid.tickArguments = function(_) {
    return arguments.length ? (tickArguments = _ == null ? [] : slice.call(_), this) : tickArguments.slice();
  };

  grid.tickValues = function(_) {
    return arguments.length ? (tickValues = _ == null ? null : slice.call(_), this) : tickValues && tickValues.slice();
  };

  grid.gup = function(_) {
    return arguments.length ? (line = _, this) : line;
  }

  return grid;
}

