export function compose(scale, accessor) {
  if (accessor.scale) {
    return accessor.scale(scale);
  }

  let f = function(...args) {
    return scale.call(this, accessor.apply(this, args));
  }

  f.scale = function(_) {
    return arguments.length ? (scale = _, this) : scale;
  }
  return f;
}
