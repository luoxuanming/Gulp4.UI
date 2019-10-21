
const { src, dest, watch, series, parallel } = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');//统一加载前缀为 gulp- 的插件（如gulp-less，gulp-autoprefixer）
const c$ = gulpLoadPlugins(); //使用时（'gulp-less'对应'c$.less', 'gulp-clean-css'对应'c$.cleanCss'）
const browserSync = require('browser-sync').create();//.create 创建Browsersync实例
const pngquant = require('imagemin-pngquant');//深度压缩
const del = require('del'); 
const fs = require('fs');
const path = require('path');
const tplDir = './src/componet';  // 模版目录

//检查js、es6语法编译
const checkjs = () =>
  src(['src/js/*.js'])
    .pipe(c$.changed('./dist/js', { extension: '.js' }))//仅监听有变化的js
    .pipe(c$.jshint({
      "esversion": 6
    }))
    .pipe(c$.jshint.reporter('default'))
    .pipe(c$.babel({//支持es6语法
      presets: ['@babel/env'] //防止报es6语法警告
    }))
    .pipe(dest('dist/js'))
    .pipe(browserSync.reload({
      stream: true
    }));

const delimages = () =>
  del(['./dist/images']);

//优化图片
const images = () =>
  src('src/images/*.+(png| jpg | jpeg | gif | svg)', 'src/images/*/*.+(png| jpg | jpeg | gif | svg)')
    .pipe(c$.cache(c$.imagemin({//压缩图片
      progressive: true,//类型：Boolean 默认：false 无损压缩jpg图片
      optimizationLevel: 3, //类型：Number  默认：3  取值范围：0-7（优化等级）
      interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
      multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
      svgoPlugins: [{ removeViewBox: false }],//不要移除svg的viewbox属性
      use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
    })))
    .pipe(dest('dist/images'))
    .pipe(browserSync.reload({
      stream: true
    }));

//less任务
const less = () =>
  src('./src/less/*.less') //该任务针对的文件
    .pipe(c$.sourcemaps.init())
    .pipe(c$.less()) //该任务调用的模块
    .on('error', function (err) {
      this.end();
    })

    .pipe(c$.autoprefixer({
      overrideBrowserslist: ['last 2 versions', 'Android >= 4.0'],
      cascade: true, //是否美化属性值 默认：true
      remove: true //是否去掉不必要的前缀 默认：true
    }))

    .pipe(c$.sourcemaps.write('./'))
    .pipe(dest('./dist/css')); //dist/css下生成main.css


//压缩css
const cleancss = () =>
  src(['./dist/css/*.css', '!./dist/css/*.min.css'])//只选出dist/css中不含有.min.css的文件
    .pipe(c$.cleanCss())
    .pipe(c$.rename({ suffix: '.min' }))
    .pipe(dest('./dist/css'));


//建立html
const buildhtml = () =>
  src('./src/views/*.html')
    .pipe(c$.changed('./src/views/**', { extension: '.html' }))
    .pipe(c$.data(function (file) {
      const filePath = file.path;
      const file_json = path.join(path.dirname(filePath), path.basename(filePath, '.html') + '.json');
      //console.log(1, JSON.parse(fs.readFileSync(tplDir + '/global.json')));
      if (fs.existsSync(file_json)) {
        //合并全局json 和 自身的json
        return Object.assign(JSON.parse(fs.readFileSync(tplDir + '/global.json')), {
          local: JSON.parse(fs.readFileSync(file_json))
        });
      }
      return JSON.parse(fs.readFileSync(tplDir + '/global.json'));
    }))
    .pipe(c$.ejs().on('error', function (err) {
      console.log("Ejs Error!", err.message);
      this.end();
    }))
    .pipe(dest('dist/html'))
    .pipe(browserSync.reload({
      stream: true
    }));

/**************搭建本地服务器环境******************/
const watchs = () => {
  watch('src/js/*.js', checkjs)
  watch('src/less/*.less', series(less, cleancss))
  watch('src/views/**', buildhtml)
  watch(['src/images/*.*', 'src/images/*/*.*'], images)
  browserSync.init({
    server: {
      baseDir: "./dist", //从dist目录中提供带有目录列表的文件
    },
    port: 8765,
    startPath: "./html/index.html",//打开第一个浏览器窗口:URL + "/index.html"
    open: "external" //Can be true, local, external, ui, ui-external, tunnel or false
  })
}

//复制
const copy = () =>
src([
  './src/libs/bootstrap/dist/js/bootstrap.min.js',
  '!./src/libs/bootstrap/dist/js/npm.js'
])
.pipe(dest('./dist/libs/bootstrap/dist'));

src([
  './src/libs/jquery/jquery.js',
  './src/libs/jquery/jquery.min.js',
  './src/libs/jquery/jquery.min.map'
])
.pipe(dest('./dist/libs/jquery'));

exports.default = series(parallel(checkjs, copy,series(less, cleancss),series(delimages,images)), buildhtml,watchs);





