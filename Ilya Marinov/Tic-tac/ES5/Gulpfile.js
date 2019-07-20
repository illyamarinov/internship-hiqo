var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var change = require('gulp-change');
var browserSync = require('browser-sync').create();

var input = './assets/scss/*.scss';
var output = './assets/css';

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

var autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

gulp.task('serve', ['add css'], function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch("assets/scss/**/*.scss", ['add css']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

gulp.task('sass', ['remove css'], function() {
    return gulp
        .src(input)
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(output))
        .pipe(browserSync.stream());
});

gulp.task('remove css', function () {
  return gulp
    .src('./index.html')
    .pipe(change(function (html) {
      return html.replace(/<link.*(app.css") \/>/, '');
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('add css', ['sass'], function () {
  return gulp
    .src('./index.html')
    .pipe(change(function (html) {
      return html.replace(/<\/head>/, '<link rel="stylesheet" href="./assets/css/app.css" /></head>');
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
  return gulp
    // Watch the input folder for change,
    // and run `sass` task when something happens
    .watch(input, ['sass'])
    // When there is a change,
    // log a message in the console
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('default', ['serve']);

gulp.task('prod', function () {
  return gulp
    .src(input)
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest(output));
});
