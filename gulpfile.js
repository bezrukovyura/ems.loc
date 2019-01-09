let gulp = require('gulp');
let tsc = require('gulp-typescript');

// let less = require('gulp-less');
// let LessAutoprefix = require('less-plugin-autoprefix');
// let autoprefix = new LessAutoprefix({ browsers: ['last 5 versions'] });

let concat = require('gulp-concat');
let del = require('del');



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

// // gulp.task('less', function () {
// //   return gulp.src(["./Styles/**/*.less", './Scripts/**/*.less'])
// //     .pipe(less({
// //       plugins: [autoprefix]
// //     }))
// //     .pipe(gulp.dest('./Styles'));
// // });

// // gulp.task('watcher', function () {
// //   gulp.watch("./Scripts/**/*.less", ['less']);
// //   gulp.watch('./Styles/**/*.less', ['less']);
// //   gulp.watch('./Scripts/**/*.ts', ['typescript']);
// // });

// //gulp.task('default', ['typescript', 'less']);





gulp.task('copyJs', function () {
  return gulp.src('./Scripts/**/*.js')
    .pipe(gulp.dest('./deploy/Scripts'));
});

gulp.task('copyCss', function () {
  return gulp.src('./Scripts/**/*.css')
    .pipe(gulp.dest('./deploy/Scripts'));
});

gulp.task('copyImg', function () {
  return gulp.src('./img/**/*.*')
    .pipe(gulp.dest('./deploy/img'));
});

gulp.task('copyHtml', function () {
  return gulp.src('./Scripts/**/*.html')
    .pipe(gulp.dest('./deploy/Scripts'));
});

gulp.task('copyPhp', function () {
  return gulp.src('./php/**/*.php')
    .pipe(gulp.dest('./deploy/php'));
});

gulp.task('copyIndex', function () {
  return gulp.src('./index.php')
    .pipe(gulp.dest('./deploy'));
});

gulp.task('vendorsJs', function () {
  return gulp.src([
    "./node_modules/angular/angular.min.js",
    "./node_modules/angular-animate/angular-animate.min.js",
    "./node_modules/angular-aria/angular-aria.min.js",
    "./node_modules/angular-messages/angular-messages.min.js",
    "./node_modules/angular-material/angular-material.min.js",
    "./node_modules/moment/min/moment.min.js",
    "./node_modules/lodash/lodash.min.js",
    "./node_modules/html2canvas/dist/html2canvas.min.js",
    "./node_modules/pdfmake/build/pdfmake.min.js",
    "./node_modules/pdfmake/build/vfs_fonts.js",
    "./node_modules/js-md5/build/md5.min.js"
  ])
    .pipe(concat('vendors.js'))
    .pipe(gulp.dest('./Scripts'));
});

gulp.task('vendorsCss', function () {
  return gulp.src([
    "./node_modules/angular-material/angular-material.min.css"
  ])
    .pipe(concat('vendors.css'))
    .pipe(gulp.dest('./Scripts'));
});


gulp.task('clean', function () {
  return del('./deploy/**/*.*', { force: true });
});


gulp.task('deploy',  gulp.series('copyHtml', 'copyJs', 'copyPhp', 'copyIndex', 'copyImg', 'copyCss'));

gulp.task('vendors', gulp.series('clean', 'vendorsJs', 'vendorsCss'));