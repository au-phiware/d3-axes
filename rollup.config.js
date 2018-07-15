import buble from 'rollup-plugin-buble';

export default {
  entry: 'index.js',
  dest: 'd3-axes.js',
  format: 'umd',
  moduleName: 'd3',
  name: 'd3',
  globals: {
    "d3-compose": "d3",
    "d3-gup": "d3",
    "d3-selection": "d3"
  },
  plugins: [
    buble()
  ]
};
