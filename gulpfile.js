const { task, src, dest, watch, series, parallel } = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');//统一加载前缀为 gulp- 的插件（如gulp-less，gulp-autoprefixer）
const c$ = gulpLoadPlugins(); //使用时（'gulp-less'对应'c$.less', 'gulp-clean-css'对应'c$.cleanCss'）
const del = require('del');
const config = require('./config/index.js');
const NODE_ENV = 'prod';//生产环境prod 开发环境dev

// exports.default = series(parallel(checkjs, copy,series(less, cleancss),series(delimages,images)), buildhtml,watchs);

if (NODE_ENV === 'dev') {
  //开发环境
  let { checkjs, copy, less, delimages, images, buildhtml, watchs } = require('./config/gulpfile.dev.js');
  exports.default = series(parallel(checkjs, copy, series(less), series(delimages, images)), buildhtml, watchs);
}

if (NODE_ENV === 'prod') {
  //生产环境
  const clean = () =>
    del(config.dist)
  let { checkjs, copy, less, cleancss, delimages, images, buildhtml, watchs } = require('./config/gulpfile.prod.js');
  exports.default = series(clean,parallel(checkjs, copy, series(less, cleancss), series(delimages, images)), buildhtml, watchs);
}
