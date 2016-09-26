import buble from 'rollup-plugin-buble';

export default {
  entry: 'index.js',
  dest: 'd3-axes.js',
  format: 'umd',
  moduleName: 'd3',
  plugins: [
    buble()
  ]
};
