import { closestClassed } from './closest';

function translate(context, v) {
  let selection = context.selection ? context.selection() : context
    , x = 0
    , y = 0
    ;
  let closest = closestClassed(selection, 'axis');
  if (selection.classed('x')) {
    y = +v;
  } else if (selection.classed('y')) {
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

let count = 0;

export function axes(x, y) {
  let paddingTop = 20
    , paddingRight = 20
    , paddingBottom = 20
    , paddingLeft = 20
    , height = 0
    , width = 0
    , index = count++
    , id = null
    ;

  function axes(context) {
    let selection = context.selection ? context.selection() : context
      , v = height - paddingTop - paddingBottom
      , h = width - paddingRight - paddingLeft
      ;

    x.scale().range([0, h]);
    y.scale().range([v, 0]);

    let id = axes.id();
    let g = selection.select("g#" + id);
    if (!g.size()) {
      g = selection.append("g")
        .attr("id", id)
        .attr("class", "axes");
      g.append("clipPath")
        .attr("id", id + "-clip-path")
        .append("rect");
    }
    g.select("#" + id + "-clip-path")
      .select("rect")
        .attr("width", h)
        .attr("height", v);

    if (context !== selection && g.transition) {
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
    return arguments.length ? (x = _, this) : x;
  };

  axes.y = function(_) {
    return arguments.length ? (y = _, this) : y;
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
    return this;
  };

  axes.height = function(_) {
    return arguments.length ? (height = _, this) : height;
  };

  axes.width = function(_) {
    return arguments.length ? (width = _, this) : width;
  };

  axes.domain = function(_x, _y) {
    if (!arguments.length)
      return [x.scale().domain(), y.scale().domain()];
    if (_x) x.scale().domain(_x);
    if (_y) y.scale().domain(_y);
    return this;
  };

  axes.id = function(_) {
    return arguments.length ? (id = _, this) : (id || 'axes-' + index);
  }

  return axes;
}

export { positionStart as axesPositionBottom, positionStart as axesPositionLeft };
export { positionEnd as axesPositionTop, positionEnd as axesPositionRight };
export { positionDefault as axesPositionDefault };
export { position as axesPosition };
