import * as d3 from "d3-selection";

function translate(context, v) {
  let selection = context.selection ? context.selection() : context
    , x = 0
    , y = 0
    ;
  if (selection.classed('x axis')) {
    y = +v;
  } else if (selection.classed('y axis')) {
    x = +v;
  } else return;
  context.attr('transform', `translate(${x} ${y})`);
}

function positionStart(selection, axis) {
  translate(selection, axis.scale().range()[0]);
}

function positionEnd(selection, axis) {
  translate(selection, axis.scale().range()[1]);
}

function positionOrigin(selection, axis) {
  translate(selection, axis.scale()(0));
}

function position(_) {
  let n = +_;
  if (isNaN(n))
    return positionDefault;
  return function(selection, axis) {
    translate(selection, axis.scale()(n));
  };
}

const positionDefault = positionOrigin;

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

function entering() {
  return !this.__grid;
}

function grid(basis) {
  let tickValues = null
    ;
  return function grid(context, axis) {
    let selection = context.selection ? context.selection() : context
      , scale = basis.scale()
      , values = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, basis.tickArguments()) : scale.domain()) : tickValues
      , range = axis.scale().range()
      , size = range[1] - range[0]
      , x, y = selection.classed("y") ? (x = "x", "y") : (x = "y", "x")
      , position = (range = basis.scale().range(), scale.bandwidth ? center : identity)(scale.copy().range([range[0] + 0.5, range[1] + 0.5]))
      , line = selection.selectAll(".grid").data(values, scale).order()
      , lineExit = line.exit()
      , lineEnter = line.enter().append("line")
          .attr("class", "grid")
          .attr(x + "2", size)
          .attr(y + "1", position)
          .attr(y + "2", position)
      ;

    line = line.merge(lineEnter);

    if (context !== selection) {
      line = line.transition(context);
      lineExit = lineExit.transition(context)
          .attr("opacity", epsilon)
          .attr(x + "2", size)
          .attr(y + "1", function(d) { return position(d); })
          .attr(y + "2", function(d) { return position(d); });
      lineEnter
          .attr("opacity", epsilon)
          .attr(y + "1", function(d) { return (this.parentNode.__grid || position)(d); })
          .attr(y + "2", function(d) { return (this.parentNode.__grid || position)(d); });
    }

    lineExit.remove();

    line.attr("opacity", 1)
        .attr(x + "2", size)
        .attr(y + "1", position)
        .attr(y + "2", position);

    selection.each(function() { this.__grid = position; });
  }
}

export function axes(x, y) {
  let paddingTop = 20
    , paddingRight = 20
    , paddingBottom = 20
    , paddingLeft = 20
    , height = 0
    , width = 0
    ;

  function axes(context) {
    let selection = context.selection ? context.selection() : context
      , v = height - paddingTop - paddingBottom
      , h = width - paddingRight - paddingLeft
      ;

    x.scale().range([0, h]);
    y.scale().range([v, 0]);

    let g = selection.select("g.axes");
    if (!g.size()) {
      g = selection.append("g")
        .attr('class', 'axes');
    }

    if (context !== selection) {
      g = g.transition(context);
    }

    g.attr("transform", "translate(" + paddingLeft + "," + paddingTop + ")");
    
    let xAxis = g.select(".x.axis");
    if (!xAxis.size()) {
      xAxis = g.append('g')
        .attr('class', 'x axis');
    }
    xAxis.call(x, y);

    let yAxis = g.select(".y.axis");
    if (!yAxis.size()) {
      yAxis = g.append('g')
        .attr('class', 'y axis')
    }
    yAxis.call(y, x);
  }

  axes.x = function(_) {
    return arguments.length ? (x = _, axes) : x;
  };

  axes.y = function(_) {
    return arguments.length ? (y = _, axes) : y;
  };

  axes.padding = function(v, h, b, l) {
    switch (arguments.length) {
      case 0:
        return {
          "top": paddingTop,
          "right": paddingRight,
          "bottom": paddingBottom,
          "left": paddingLeft
        };
      case 1:
        h = b = l = v;
        break;
      case 2:
        [ b, l ] = [ v, h ];
        break;
      case 3:
        l = h;
        break;
    }
    [ paddingTop, paddingRight, paddingBottom, paddingLeft ] = [ v, h, b, l ];
    return axes;
  };

  axes.height = function(_) {
    return arguments.length ? (height = _, axes) : height;
  };

  axes.width = function(_) {
    return arguments.length ? (width = _, axes) : width;
  };

  axes.domain = function(_x, _y) {
    if (!arguments.length)
      return [x.scale().domain(), y.scale().domain()];
    if (_x) x.scale().domain(_x);
    if (_y) y.scale().domain(_y);
    return axes;
  };

  return axes;
}

export { positionStart as axesPositionBottom, positionStart as axesPositionLeft };
export { positionEnd as axesPositionTop, positionEnd as axesPositionRight };
export { positionDefault as axesPositionDefault };
export { position as axesPosition };
export { grid as axesGrid };
