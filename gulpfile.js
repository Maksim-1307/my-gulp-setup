var gulp = require('gulp');
var rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const pug = require('gulp-pug');
const browsersync = require('browser-sync').create();
var concat = require('gulp-concat');
const tap = require('gulp-tap');
const { fstat } = require('fs');
const fs = require('fs');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

//SETTINGS

let currentPage = 'index.pug';
let toCompress = true;


//PROJECT STRUCTURE

//folders
let folders = [];
folders.build = "$dist/";
folders.source = "$src/";
folders.pug = folders.source + 'pug/';
folders.pages = folders.pug + 'pages/';
folders.pug_blocks = folders.pug + 'blocks/';
folders.scss = folders.source + 'scss/';
folders.scss_blocks = folders.scss + 'blocks/';
folders.js = folders.source + 'js/';
folders.img = folders.source + 'img/';
folders.icons = folders.img + 'icons/';

//files
let files = [];
files.main_page = folders.pages + 'index.pug';
files.sytle = folders.scss + 'style.scss';



function build_structure(done) {
    for (var obj in folders) {
        fs.mkdirSync(folders[obj], { recursive: true }, (err) => {
            if (err) console.error(err);
        });
    }
    for (var obj in files) {
        fs.writeFile(files[obj], '', (err) => {
            if (err) console.error(error);
        });
    }
    done();
}

function compile_scss(done) {
    gulp.src(files.sytle)
        .on('error', console.error.bind(console))
        .pipe(sass({
            errorLogToConsole: true,
            outputStyle: (toCompress) ? 'compressed' : 'expanded'
        }))
        .on('error', console.error.bind(console))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(rename("style.css"))
        .pipe(gulp.dest(folders.build))
        .pipe(browsersync.stream());
    done();
}

function compile_pug(done) {
    gulp.src(folders.pages + "*.pug")
        .on('error', console.error.bind(console))
        .pipe(pug({
            pretty: (toCompress) ? false : true
        }))
        .on('error', console.error.bind(console))
        .pipe(rename(tap(function (file) {
            return (file.basename);
        })))
        .pipe(gulp.dest(folders.build))
        .pipe(browsersync.stream());
    done();
}

function process_js(done) {
    gulp.src(folders.js + "*.js")
        .pipe(concat('script.js'))
        .pipe(gulp.dest(folders.build))
        .pipe(browsersync.stream());
    done();
}

function process_img(done) {
    gulp.src(folders.img + "/**/*")
        .pipe(gulp.dest(folders.build + "img"))
        .pipe(browsersync.stream());
    done();
    console.log('img processing');
}

function process_fonts(done) {
    console.log('WARNING! FONTS PROCESSING NOT REALIZED!');
    done();
}

function browser_init(done) {
    browsersync.init({
        server: {
            baseDir: folders.build,
            index: currentPage.replace('.pug', '.html')
        },
        files: "#dist/*",
        port: 3000
    });
    done();
}

function watcher() {
    gulp.watch(folders.source + "**/*.scss", compile_scss);
    gulp.watch(folders.source + "**/*.pug", compile_pug);
    gulp.watch(folders.source + "**/*.{jpg,png,jpeg,webp,svg,gif}", process_img);
    gulp.watch(folders.source + "**/*.js", process_js);
    gulp.watch(folders.source + "**/*.{ttf,woff2,woff,otf}", process_fonts);
    gulp.watch(folders.source + "texts/*.txt");
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
gulp.task('init', build_structure);

gulp.task('default', gulp.series(compile_pug, compile_scss, process_js, process_img, browser_init, watcher));


/*

compress js files

save min and default files versions 

console input name of block

add multiply pug pages

при изменениях должны перекомпилироваться все файлы, а не только выбранный

*/