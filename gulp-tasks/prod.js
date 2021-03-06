const gulp = require('gulp');
const del = require('del');
const nodemon = require('gulp-nodemon');
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;

gulp.task('clean-prod', () => {
    return del(['./dist'])
});

gulp.task('compile-server-prod', (done) => {
    exec('tsc', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        done(err);
    })
});

gulp.task('compile-client-prod', (done) => {
    exec('cd src/client && node fuse-prod-host && node fuse-prod-client', (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        done(err);
    })
});

gulp.task('copy-client-assets-prod', gulp.parallel(
    function copypublic() {
        return gulp.src('./src/client/public/**/*')
            .pipe(gulp.dest('dist/client/public/'))
    }, function copyviews() {
        return gulp.src('./src/client/views/**/*')
            .pipe(gulp.dest('dist/client/views'))
    }));

gulp.task('build-prod', gulp.series(
    'clean-prod',
    'compile-server-prod',
    gulp.parallel('copy-client-assets-prod', 'compile-client-prod'),
));

