const nonEnumerableProps = /^(valueOf|isPrototypeOf|to(Locale)?String|propertyIsEnumerable|hasOwnProperty)$/;

export function compose(...args) {
  const start = args.length - 1;
  let f = function(...pass) {
    let i = start;
    let v = args[i].apply(this, pass);
    while (i--) v = args[i].call(this, pass[0], v);
    return v;
  };
  for (let i = start; i >= 0; i--) {
    let source = args[i];
    for (let k in source) {
      if (!nonEnumerableProps.test(k)) {
        f[k] = source[k];
      }
    }
  }
  return f;
}
