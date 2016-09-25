import * as d3 from "d3-selection";

function translate(x = 0, y = 0) {
  return `translate(${+x} ${+y})`;
}

function positionStart(axis) {
  return axis.scale().range()[0];
}

function positionEnd(axis) {
  return axis.scale().range()[1];
}

function positionOrigin(axis) {
  return axis.scale()(0);
}

function positioner(_) {
  if (typeof _ === "function")
    return _;
  let n = +_;
  if (isNaN(n))
    return positionDefault;
  return function(axis) {
    return axis.scale()(n);
  };
}

const positionDefault = positionOrigin;

function grid(selection, my, axis) {
}

export function axes(x, y) {
  let paddingTop = 20
    , paddingRight = 20
    , paddingBottom = 20
    , paddingLeft = 20
    , height = 0
    , width = 0
    , positionX = null
    , positionY = null
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

    g.attr("transform", "translate(" + paddingLeft + "," + paddingTop + ")");
    
    g.append('g')
      .attr('class', 'x axis')
      .attr('transform', translate(0, (positionX || positionDefault)(y)))
      .call(x);

    g.append('g')
      .attr('class', 'y axis')
      .attr('transform', translate((positionY || positionDefault)(x)))
      .call(y);

    return g;
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

  axes.position = function(_x, _y) {
    if (!arguments.length)
      return [positionX || positionDefault, positionY || positionDefault];
    if (_x) positionX = positioner(_x);
    if (_y) positionY = positioner(_y);
    return axes;
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
