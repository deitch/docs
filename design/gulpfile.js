var gulp            = require("gulp")
    sass            = require("gulp-sass")
    autoprefixer    = require("gulp-autoprefixer")
    sassGlob        = require('gulp-sass-glob')
    glob            = require("glob")
    del             = require("del")
    nunjucksRender  = require("gulp-nunjucks-render")
    browserSync     = require("browser-sync").create()
    plumber         = require("gulp-plumber")
    svgSprite       = require('gulp-svg-sprite')

    // --------------------------------

    // Concat and copy CSS
    gulp.task("scss", function () {
      gulp.src("scss/**/*.scss")
        .pipe(plumber())
        .pipe(sassGlob())
        .pipe(sass({outputStyle : "expanded"}))
        .pipe(autoprefixer({browsers : ["last 6 versions"]}))
        .pipe(gulp.dest("public/css/"))
    })

    // Copy javascript
    gulp.task("js", function () {
      gulp.src("js/**/*.js")
        .pipe(plumber())
        .pipe(gulp.dest("public/js/"))
    })

    // Assets copy
    gulp.task("assets", function () {
      gulp.src("assets/**/*")
        .pipe(plumber())
        .pipe(gulp.dest("public/assets/"))
    })

    // Watch asset folders for changes
    gulp.task("watch", ["scss", "js", "assets"], function () {
      gulp.watch("js/**/*", ["js"])
      gulp.watch("scss/**/*", ["scss"])
      gulp.watch("assets/**/*", ["assets"])
    })

    // SVG Config
    var config = {
      shape: {
        id: {
          separator: "_",
          whitespace: '_'
        }
      },
      mode: {
        symbol: { // symbol mode to build the SVG
          dest: 'assets/icons/renders',
          sprite: 'sprite.svg',
          example: true,
          dimensions: "_svg",
          prefix: ".icon_"
        }
      },
      svg: {
        namespaceIDs: false,
        dimensionAttributes: false,
        xmlDeclaration: false, // strip out the XML attribute
        doctypeDeclaration: false // don't include the !DOCTYPE declaration
      }
    };

    gulp.task('sprite-page', function() {
      gulp.src('assets/icons/source/**/*.svg')
        .pipe(plumber())
        .pipe(svgSprite(config))
        .pipe(gulp.dest('.'));
    });

    gulp.task('sprite-shortcut', function() {
      gulp.src('assets/icons/renders/*')
        .pipe(plumber())
        .pipe(gulp.dest('templates/'));
    });


    // --------------------------------------
    // Test templates
    // --------------------------------------

    // Render templates
    gulp.task("render", function () {
      gulp.src("templates/*")
        .pipe(plumber())
        .pipe(nunjucksRender(
          {
            path: "templates",
            inheritExtension: true,
          }))
        .pipe(gulp.dest("public"))
    })

    // Watch more things
    gulp.task("watch-all", ["scss", "js", "assets", "render"], function () {
      gulp.watch("js/**/*", ["js"])
      gulp.watch("scss/**/*", ["scss"])
      gulp.watch("assets/**/*", ["assets"])
      gulp.watch("templates/**/*", ["render"])
    })

    // Spin up server
    gulp.task('browser-sync', function() {
        browserSync.init({
            server: {
                baseDir: "public",
            },
            notify: false
        });
        gulp.watch("public/**/*").on('change', browserSync.reload);
    });

    // --------------------------
    // Task runners syntax
    // --------------------------

    // Just do a build
    gulp.task("default", ["render"])

    // Spins up a sever to render test templates
    gulp.task("serve", ["watch-all", "browser-sync"])

    // Run a build
    gulp.task("build", ["scss", "js", "assets"])

    // Icon Build
    gulp.task('icons:build', ['sprite-page', 'sprite-shortcut']);
