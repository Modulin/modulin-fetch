import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/modulin/main-amd.js',
  dest: 'dist/modulin-fetch.amd.module.js',
  format: 'es',
  moduleName: 'modulinFetch',

  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: 'es2015-rollup'
    })
  ]
}