let gulp = require('gulp');
let tsc = require('gulp-typescript');
let less = require('gulp-less');
let LessAutoprefix = require('less-plugin-autoprefix');
let autoprefix = new LessAutoprefix({ browsers: ['last 10 versions'] });
let concat = require('gulp-concat');
let del = require('del');
let lessClean = require('gulp-clean-css');
let _pug = require('gulp-pug');
 
gulp.task('pug', function buildHTML() {
  return gulp.src('./index.pug')
  .pipe(_pug({pretty: false}))
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
    .pipe(gulp.dest('./'));
});

gulp.task('less', function () {
    return gulp.src(["./Style/style.less"])
      .pipe(less({
        plugins: [autoprefix]
      }))   
      .pipe(lessClean({
        compatibility: 'ie8'
      }))
      .pipe(gulp.dest('./'));
  });

gulp.task('concatJs', function () {
  return gulp.src([
    "./node_modules/jquery/dist/jquery.min.js",
    "./Scripts/lib/fm.revealator.jquery.min.js",
    "./scripts.js"
  ])
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('./'));
});


gulp.task('clean', function () {
  return del('./_deploy/**/*.*', { force: true });
});


gulp.task('default',  gulp.series('typescript', 'less', 'pug', 'concatJs'));

gulp.task('watcher',function(){
  gulp.watch('./**/*.pug',  gulp.series('pug'));
  gulp.watch('./**/*.less', gulp.series('less'));
  gulp.watch('./**/*.ts', gulp.series('typescript'));
});