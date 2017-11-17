'use strict';

const gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    babel = require('gulp-babel'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    useref = require('gulp-useref'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    dir = {
        src: 'src',
        dist: 'dist',
        nm: 'node_modules'
    },
    files = {
        CSS: [
            `${dir.dist}/css/styles.css`
        ],
        mCSS: 'styles.min.css',
        JS: [
            `${dir.dist}/js/scripts.js`,
        ],
        mJS: 'scripts.min.js',
        fonts: [
            //tipografias

        ],
        statics: [
            `${dir.src}/humans.txt`,
            `${dir.src}/sitemap.xml`
        ]
    },
    opts = {
        sass: {
            outputStyle: 'compressed'
        },
        es6: {
            presets: ['env']
        },
        imagemin: {
            progressive: true,
            use: [pngquant()]
        },
        autoprefixer: {
            browsers: ['last 5 versions'],
            cascade: false
        },
        htmlmin: {
            collapseWhitespace: true
        }

    };




gulp.task('default', ['sass', 'es6'], () => {
    browserSync.init({
        server: {
            baseDir: "./",
            index: "index.html"
        }
    });

    gulp.watch(`${dir.src}/scss/*.scss`, ['sass']);
    gulp.watch(`${dir.src}/es6/*.js`, ['es6']);
    gulp.watch("./*.html").on('change', browserSync.reload);
});

gulp.task('sass', () => {
    gulp
        .src(`${dir.src}/scss/*.scss`)
        .pipe(sass(opts.sass).on('error', sass.logError))
        .pipe(gulp.dest(`${dir.dist}/css`))
        .pipe(browserSync.stream())
});

gulp.task('es6', () => {
    gulp
        .src(`${dir.src}/es6/*.js`)
        .pipe(babel(opts.es6))
        .pipe(gulp.dest(`${dir.dist}/js`))
});

gulp.task('compilar', ['sass', 'es6']);

//------------------------------

gulp.task('img', () => {
    gulp
        .src(`${dir.src}/img/**/*.*`)
        .pipe(imagemin(opts.imagemin))
        .pipe(gulp.dest(`${dir.dist}/img`))
});

gulp.task('webp', () => {
    gulp
        .src(`${dir.src}/img/**/*.*`)
        .pipe(webp(opts.webp))
        .pipe(gulp.dest(`${dir.dist}/img/webp`))
});

gulp.task('fonts', () => {
    gulp
        .src(files.fonts)
        .pipe(gulp.dest(`${dir.dist}/fonts`))
});

gulp.task('build:media', ['img', 'webp', 'fonts']);

gulp.task('css', () => {
    gulp
        .src(files.CSS)
        .pipe(concat(files.mCSS))
        .pipe(autoprefixer(opts.autoprefixer))
        .pipe(cleanCSS())
        .pipe(gulp.dest(`${dir.dist}/css`))
});

gulp.task('js', () => {
    gulp
        .src(files.JS)
        .pipe(concat(files.mJS))
        .pipe(uglify())
        .pipe(gulp.dest(`${dir.dist}/js`))
});

gulp.task('html', () => {
    gulp
        .src(`${dir.dist}/*.html`)
        .pipe(useref())
        .pipe(htmlmin(opts.htmlmin))
        .pipe(gulp.dest(dir.dist))
});


//compilar y mnificar
gulp.task('final-code', ['css', 'js', 'html']);