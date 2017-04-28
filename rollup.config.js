import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/modulin/main-amd.js',
  dest: 'dist/modulin-fetch.amd.min.js',
  format: 'iife',
  moduleName: 'modulinFetch',

  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: 'es2015-rollup'
    }),
    uglify({
      drop_debugger: true,
      evaluate: true,
      reduce_vars: true,
      pure_getters: true
    })
  ]
}