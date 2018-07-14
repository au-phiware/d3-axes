import { compose as scaler } from './scaler';

let count = 0;

export function shape(path) {
  let data = []
    , index = count++
    , id = null
    , update = $ => $
    , exit = $ => $.remove()
    , enter = $ => $
    , merge = $ => $.attr("d", path)
    ;
  function shape(axes, context, ...args) {
    if (path.x) {
      path.x(scaler(axes.x().scale(), path.x()));
    }
    if (path.y) {
      path.y(scaler(axes.y().scale(), path.y()));
    }

    context = axes.apply(this, [context].concat(args));

    let shouldTransition = !!context.selection;
    let selection = shouldTransition ? context.selection() : context;
    selection = selection.select('.axes');

    let id = shape.id();
    let g = selection
      .select('g#' + id);
    if (g.empty()) {
      g = selection.append('g')
        .attr('id', id)
        .attr('class', 'shapes');
    }

    g = g.selectAll('path.shape').data(data);
    let $update = g;
    if (shouldTransition) {
      $update = $update.transition(context);
    }
    $update.call(shape.update());
    if (shouldTransition) {
      $update = $update.selection();
    }

    let $exit = g.exit();
    if (shouldTransition) {
      $exit = $exit.transition(context);
    }
    $exit.call(shape.exit());

    let $enter = g.enter()
      .append("path")
      .attr('class', 'shape')
      .call(shape.enter());

    $update = $enter.merge($update)
    if (shouldTransition) {
      $update = $update.transition(context);
    }
    $update.call(shape.merge());
  }

  shape.path = function(_) {
    return arguments.length ? (path = _, shape) : path;
  }

  shape.data = function(_) {
    return arguments.length ? (data = _, shape) : data;
  }

  shape.id = function(_) {
    return arguments.length ? (id = _, shape) : (id || 'axes-shape-' + index);
  }

  shape.update = function(_) {
    return arguments.length ? (update = _, shape) : update;
  }

  shape.exit = function(_) {
    return arguments.length ? (exit = _, shape) : exit;
  }

  shape.enter = function(_) {
    return arguments.length ? (enter = _, shape) : enter;
  }

  shape.merge = function(_) {
    return arguments.length ? (merge = _, shape) : merge;
  }

  return shape;
}
