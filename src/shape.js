import { gup, gupCompose } from 'd3-gup';
import { compose as scaler } from './scaler';

let count = 0;

const shapes = gup()
  .select(($, id) => $.select('.axes').selectAll(`g#${id}`))
  .enter(($, id) => $.append('g')
    .attr('id', id)
    .attr('class', 'shapes'))([null]);

export function shape(path) {
  let index = count++
    , id = null
    , call = gup()
        .select($ => $.selectAll('path.shape'))
        .exit($ => $.remove())
        .enter($ => $.append("path")
          .attr("d", path)
          .attr('class', 'shape'))
        .pre($ => $.attr("d", path))
    , data = call([])
  ;
  function shape(context, axes, ...args) {
    if (path.x) {
      path.x(scaler(axes.x().scale(), path.x()));
    }
    if (path.y) {
      path.y(scaler(axes.y().scale(), path.y()));
    }

    axes.apply(this, [context, ...args]);
    shapes(context, shape.id())
      .call(data, ...args);
  }

  shape.path = function(_) {
    return arguments.length ? (path = _, this) : path;
  }

  shape.data = function(..._) {
    return arguments.length
      ? (data = call(..._), this)
      : (data.data ? data.data() : data);
  }

  shape.id = function(_) {
    return arguments.length ? (id = _, this) : (id || 'axes-shape-' + index);
  }

  shape.gup = function(_) {
    return arguments.length ? (call = _, this) : call;
  }

  return shape;
}

export function symbol(path) {
  let x = d => d[0]
    , y = d => d[1]
  ;

  path.x = function(_) {
    return arguments.length ? (x = _, this) : x;
  }

  path.y = function(_) {
    return arguments.length ? (y = _, this) : y;
  }

  let $ = shape(path);
  $.gup(
    gupCompose(
      gup()
      .pre(translate)
      .enter(translate)
    , $.gup()
    )
  );
  return $;

  function translate($) {
    return $.attr('transform', d => `translate(${
      path.x()(d)
    } ${
      path.y()(d)
    })`)
  }
}
