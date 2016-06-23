var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    del = require('del'),
    iconfont = require('gulp-iconfont'),
    consolidate = require('gulp-consolidate'),
    runSequence = require('run-sequence'),
    extreplace = require('gulp-ext-replace'),
    autoprefixer = require('gulp-autoprefixer'),
    argv = require('yargs').argv,
    gulpif = require('gulp-if'),
    minifyCSS = require('gulp-minify-css'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream');
   

var destinationRoot = '../ChallengeBoard.Web/Static';
var sourceRoot = '../ChallengeBoard.Web/Content';

//Source folders.
var src = {
    sassFilesToProcess: sourceRoot + '/Styles/*.scss',
    sassFilesToWatch: sourceRoot + '/Styles/**/*.scss',
    svgIcons: sourceRoot + '/Icons/*.svg',
    iconSassFiles: sourceRoot + '/Styles/Icons/',
    scriptFilesToProcess: sourceRoot + '/Scripts/main.js',
    scriptFilesToWatch: sourceRoot + '/Scripts/**/*.js',
    imagesToProces: sourceRoot + '/Images/**/*.*'
};

//Destination folders.
var dest = {
    processedStyles: destinationRoot + '/Styles/',
    processedFonts: destinationRoot + '/Fonts/',
    processedScripts: destinationRoot + '/Scripts/',
    processedImages: destinationRoot + '/Images/'
};

// Process scripts.
gulp.task('scripts', function () {
    browserify({
        entries: src.scriptFilesToProcess,
        debug: true
    })
    .transform(babelify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest(dest.processedScripts));
});

// Process styles.
gulp.task('styles', function () {
    return gulp.src(src.sassFilesToProcess)
        .pipe(sass({
            errLogToConsole: true
        }))
        //.pipe(minifyCSS())  
        .pipe(gulp.dest(dest.processedStyles));
});

gulp.task('images', function () {
    return gulp.src(src.imagesToProces)         
        .pipe(gulp.dest(dest.processedImages));
});

// Generates an icon font based on svg icons i source folder and updates css template. 
gulp.task('icons', function () {
    return gulp.src(src.svgIcons)
        .pipe(iconfont({
            fontName: 'icons',
            appendCodepoints: true,
            normalize: true,
            fontHeight: 448,
            descent: 62
        })).on('codepoints', function (codepoints) {
            del([src.iconSassFiles + '_Icons.scss'], {
                force: true
            }, function () {
                gulp.src(src.iconSassFiles + '/Templates/*.tmpl')
                .pipe(consolidate('lodash', {
                    glyphs: codepoints
                }))
                .pipe(extreplace('.scss'))
                .pipe(gulp.dest(src.iconSassFiles));
            });
        })
        .pipe(gulp.dest(dest.processedFonts));
});

//Build task. Runs serial and parallel tasks in correct order.
gulp.task('build', function () {
    runSequence('icons', ['scripts', 'styles'], 'images');
});

//Runs build tasks and start watching for changes. Run as "gulp watch".
gulp.task('watch', ['build'], function () {
    gulp.watch(src.scriptFilesToWatch, ['scripts']);
    gulp.watch(src.sassFilesToWatch, ['styles']);
    gulp.watch(src.svgIcons, ['icons']);
    gulp.watch(src.imagesToProces, ['images']);
});

//Defaults when running just "gulp".
gulp.task('default', ['build']);