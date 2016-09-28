import * as d3 from 'd3-selection';

export function closestClassed(selection, className) {
  let closest = selection;
  while (!closest.classed(className)) {
    closest = closest.node().parentElement;
    if (!closest) return;
    closest = d3.select(closest);
  }
  return closest;
}
