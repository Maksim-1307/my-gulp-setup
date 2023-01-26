var gulp = require('gulp');
var rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const pug = require('gulp-pug');
const browsersync = require('browser-sync').create();
var concat = require('gulp-concat');

var currentPugFile = "roads";

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

// paths

//folders
let build_folder = "#dist";
let source_folder = "#src";

//files
let pug_file = source_folder + "/" + currentPugFile + ".pug";
let style_file = source_folder + "/style.scss";


function compile_scss(done) {
    console.log("starting processing scss")
    gulp.src(style_file)
        .on('error', console.error.bind(console))
        .pipe(sass({
            errorLogToConsole: true
            //outputStyle: 'compressed'
        }))
        .on('error', console.error.bind(console))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(rename("style.css"))
        .pipe(gulp.dest(build_folder));
    console.log("finish processign scss");
    done();
}

function compile_pug(done) {
    gulp.src(pug_file)
        .on('error', console.error.bind(console))
        .pipe(pug({
            pretty: true
        }))
        .on('error', console.error.bind(console))
        .pipe(rename(currentPugFile + ".html"))
        .pipe(gulp.dest(build_folder));
    done();
}

function process_js(done) {
    gulp.src(source_folder + "/js/*.js")
        .pipe(concat('script.js'))
        .pipe(gulp.dest(build_folder))
        .pipe(browsersync.stream());
    done();
}

function process_img(done) {
    console.log('WARNING! IMG PROCESSING NOT REALIZED!');
    done();
}

function process_fonts(done) {
    console.log('WARNING! FONTS PROCESSING NOT REALIZED!');
    done();
}

function browser_init(done) {
    browsersync.init({
        server: {
            baseDir: build_folder,
            index: currentPugFile + ".html"
        },
        files: "#dist/*",
        port: 3000
    });
    done();
}

function watcher() {
    gulp.watch(source_folder + "/**/*.scss", compile_scss);
    gulp.watch(source_folder + "/**/*.pug", compile_pug);
    gulp.watch(source_folder + "/**/*.{jpg,png,jpeg,webp,svg,gif}", process_img);
    gulp.watch(source_folder + "/**/*.js", process_js);
    gulp.watch(source_folder + "/**/*.{ttf,woff2,woff,otf}", process_fonts);
    gulp.watch(source_folder + "/scss/*.scss"); 
    gulp.watch(source_folder + "/pug/*.pug");
    gulp.watch(source_folder + "/texts/*.txt");
    browsersync.stream();
}

function block(done) {
    console.log('WARNING! BLOCK NOT REALIZED!');
    let name = process.argv[2];
    if (name) {
        console.log(name);
        done();
    } else {
        console.log('ERROR');
    }
}

gulp.task('scss', compile_scss);
gulp.task('pug', compile_pug);
gulp.task('js', process_js);
gulp.task('img', process_img);
gulp.task('fonts', process_fonts);
gulp.task(block);

gulp.task('default', gulp.series(compile_pug, compile_scss, process_js, browser_init, watcher));


/*

compress js files

save min and default files versions 

console input name of block

add multiply pug pages

при изменениях должны перекомпилироваться все файлы, а не только выбранный

невозможно использовать один js файл на всех страницах. Выдает ошибки, есои нет нужных элементов

*/