var gulp     = require('gulp'),
sass         = require('gulp-sass'),
watch        = require('gulp-watch');

gulp.task('sass', function () {
 return gulp.src('./src/scss/shell.scss')
   .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
   .pipe(gulp.dest('./dist/css'));
});

gulp.task('watch', function () {
    gulp.watch(['./src/scss/shell.scss'], ['sass']);
});
gulp.task('default', ['sass', 'watch']);
gulp.task('build', ['sass']);
