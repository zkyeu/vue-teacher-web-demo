/**
 * Created by li on 2017/3/22.
 */
'use strict'

var gulp = require('gulp'),
    less = require('gulp-less'),
    ejs =  require('gulp-ejs'),
    htmlmin  = require('gulp-htmlmin'),//压缩html
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),//Gulp 错误管理
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    debug = require('gulp-debug'),
    transport = require('gulp-seajs-transport'),//模块压缩
    browserSync  = require('browser-sync'),//浏览器自动刷新
    reload = browserSync.reload,
    cleancss = require('gulp-clean-css');


gulp.task('html', function(){
    gulp.src('ejs/*.ejs')
    .pipe(ejs({
        csslink : 'css/',
        jslink : 'js/'
    }))
    .pipe(htmlmin({
        collapseWhitespace:true,
        collapseBooleanAttributes:true,
        removeComments:true,
        removeEmptyAttributes:true,
        removeScriptTypeAttributes:true,
        removeStyleLinkTypeAttributes:true,
        minifyJS:true,
        minifyCSS:true
    }))
    .pipe(gulp.dest('../html/'))
    // .pipe(browserSync.stream());
    .pipe(reload({stream: true}));
});

gulp.task('css', function(){
    gulp.src('less/*.less')
    .pipe(less())
    .pipe(cleancss())
    .pipe(gulp.dest('../html/css/'))
    // .pipe(browserSync.stream());
    .pipe(reload({stream: true}))
});

gulp.task('js', function(){
    gulp.src(['js/mod/*.js', 'js/common/*.js', 'js/*.js'])
    .pipe(plumber())
    // .pipe(transport())
    .pipe(concat('js.js'))
    .pipe(uglify({
        ascii_only : true
    }))
    .pipe(gulp.dest('../html/js/'))
    .pipe(reload({stream: true}));
    // .pipe(browserSync.stream());
});

gulp.task('img', function(){
    gulp.src('image/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('../html/image/'))
    .pipe(browserSync.stream());
});

gulp.task('server', ['html', 'js', 'css', 'img'], function(){
    browserSync.init({
        server : {
            baseDir : '../html/'
        }
    });
    gulp.watch('less/*.less',['css']);
    gulp.watch('ejs/*.ejs',['html']);
    gulp.watch(['js/*.js','js/common/*.js'],['js']);
    gulp.watch('image/*.*',['img']);
    console.log("gulp start");
});

gulp.task('default', ['server'], function () {
    console.log('================start================')
})
