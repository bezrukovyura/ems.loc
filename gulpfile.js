let gulp = require('gulp');
let tsc = require('gulp-typescript');
let less = require('gulp-less');
let LessAutoprefix = require('less-plugin-autoprefix');
let autoprefix = new LessAutoprefix({ browsers: ['last 10 versions'] });
let concat = require('gulp-concat');
let del = require('del');


var _pug = require('gulp-pug');
 
gulp.task('pug', function buildHTML() {
  return gulp.src('./index.pug')
  .pipe(_pug({pretty: true}))
  .pipe(gulp.dest('./'));
});

gulp.task('typescript', function () {
  return gulp.src('./Scripts/**/*.ts')
    .pipe(tsc({
      noImplicitAny: true,
      removeComments: true,
      preserveConstEnums: true,
      sourceMap: true,
      target: "ES5"
    }))
    .pipe(gulp.dest('./Scripts'));
});

gulp.task('less', function () {
    return gulp.src(["./Style/style.less"])
      .pipe(less({
        //plugins: [autoprefix]
      }))
      .pipe(gulp.dest('./'));
  });

gulp.task('copyFiles', function () {
  return gulp.src('./Scripts/**/*.js')
    .pipe(gulp.dest('./deploy/Scripts'));
});

gulp.task('vendorsJs', function () {
  return gulp.src([
    "./node_modules/angular/angular.min.js"
  ])
    .pipe(concat('vendors.js'))
    .pipe(gulp.dest('./Scripts'));
});

gulp.task('vendorsCss', function () {
  return gulp.src([
    "./node_modules/angular-material/angular-material.min.css"
  ])
    .pipe(concat('vendors.css'))
    .pipe(gulp.dest('./Style'));
});

gulp.task('clean', function () {
  return del('./_deploy/**/*.*', { force: true });
});


gulp.task('default',  gulp.series('typescript', 'less', 'pug'));

gulp.task('vendors', gulp.series('clean', 'vendorsJs', 'vendorsCss'));

gulp.task('deploy',  gulp.series('clean', 'typescript', 'less', 'vendors', 'copyFiles'));


gulp.task('watcher',function(){
  gulp.watch('./**/*.pug',  gulp.series('pug'));
  gulp.watch('./**/*.less', gulp.series('less'));
});