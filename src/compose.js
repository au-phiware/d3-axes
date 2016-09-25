const nonEnumerableProps = /^(valueOf|isPrototypeOf|to(Locale)?String|propertyIsEnumerable|hasOwnProperty)$/;

export function compose(...args) {
  const start = args.length - 1;
  let f = function(...pass) {
    let i = start + 1;
    while (i--) args[i].apply(this, pass);
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
