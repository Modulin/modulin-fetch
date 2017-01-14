import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'src/main.js',
  dest: 'dist/modulin.js',
  format: 'iife',
  moduleName: 'modulin',

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