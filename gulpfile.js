var gulp = require('gulp');
var install = require('gulp-install');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var exec = require('child_process').exec;

gulp.task('server', function (cb) {
  exec('mongod', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
  exec('node server.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('browserify', function() {
  // Grabs the app.js file
    return browserify('./public/js/app.js')
      // bundles it and creates a file called main.js
        .bundle()
        .pipe(source('main.js'))
        // saves it the public/js/ directory
        .pipe(gulp.dest('./public/main/'));
});

gulp.task('watch', function(){
  gulp.watch('public/js/*.js', ['browserify']);
  gulp.watch('public/js/**/*.js', ['browserify']);
});

gulp.task('install', function () {
  gulp.src(['./package.json'])
  .pipe(install());
});

gulp.task('default', ['install', 'watch', 'server', 'browserify']);