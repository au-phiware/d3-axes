import buble from 'rollup-plugin-buble';

export default {
  input: 'index.js',
  output: {
    file: 'd3-axes.js',
    format: 'umd',
    name: 'd3',
    globals: {
      "d3-compose": "d3",
      "d3-gup": "d3",
      "d3-selection": "d3"
    }
  },
  plugins: [
    buble()
  ]
};
