module.exports = function (grunt) {

   grunt.initConfig({
      pkg: grunt.file.readJSON("package.json"),
      browserify: {
         dist: {
            options: {
               transform: [
                  ["babelify", { presets: ["es2015"] }]
               ]
            },
            files: {
               "./public/system/build/app3d.js": ["./public/system/src/app/app3d.js"]
            }
         },
         mgmt: {
          options: {
              transform: [
                ["babelify", {presets: ["react", "es2015", "stage-2"]}]
              ],
              external: [
                "axios",
                "react",
                "react-dom",
                "react-redux",
                "react-select",
                "redux",
                "redux-promise",
                "redux-form",
                "react-router"
              ]
          },
          files: {
              "./public/system/build/mgmt.js": ["./public/system/src/mgmt/index.js"]
          }
        },
        mgmtVendor: {
          src: ['.'],
          dest: './public/system/build/mgmt-vendors.js',
          options: {
            debug: false,
            alias: [
                "axios",
                "react",
                "redux",
                "react-dom",
                "react-select",
                "react-redux",
                "redux-promise",
                "redux-form",
                "react-router"
            ]
          }
        } 
      },
      sass: {
          dist: {
            files: {
                    './public/system/css/styles.css' : './public/system/css/styles.scss'
            }
        }
      },
      watch: {
         scripts: {
            files: ["./public/system/src/**/*.js" ],
            tasks: ["browserify:dist", "browserify:mgmt"]
         }
      },
      concat: {
        bootstrap: {
          src: [
            "./public/resources/js/bootstrap/transition.js",
            "./public/resources/js/bootstrap/alert.js",
            "./public/resources/js/bootstrap/button.js",
            "./public/resources/js/bootstrap/collapse.js",
            "./public/resources/js/bootstrap/dropdown.js",
            "./public/resources/js/bootstrap/modal.js",
            "./public/resources/js/bootstrap/tooltip.js",
            "./public/resources/js/bootstrap/popover.js",
            "./public/resources/js/bootstrap/tab.js",
          ],
          dest: "./public/resources/js/bootstrap.js"
        },
        apps: {
          src: [
            "./public/resources/js/apps/global.js",
            "./public/resources/js/apps/user.js",
            "./public/resources/js/apps/home.js",
          ],
          dest: "./public/resources/js/apps.js"
        },
        plugins: {
          src: ["./public/resources/js/plugins/*"],
          dest: "./public/resources/js/plugins.js"
        }
      },
      jshint: {
        options: {
          reporter: require('jshint-stylish')
        },
        bootstrap: {
          options: {
            jshintrc: "public/js/bootstrap/.jshintrc",
          },
          src: "'public/js/bootstrap/*.js'"
        },
        web: {
          jshintrc: "public/js/.jshintrc",
          src: ['public/js/apps/*.js']
        },
        afterConcat: {
          src: ['public/js/apps.js']
        }
      },      
      uglify: {
        options: {
          banner: '\n/*! <%= pkg.name %> <%= grunt.template.today("dd-mmm-yyyy hh:MM:ss Z", true) %> */\n',
          preserveComments: 'some',
          report: "min",
          compress: {
            dead_code: true,
            drop_console: true
          }
        },
        main_script: {
          src: ["<%= concat.bootstrap.dest %>", "./public/resources/js/plugins.js", "./public/resources/js/apps.js"],
          dest: "./public/resources/js/apps.min.js"
        },
        mgmt: {
          src: ["./public/system/build/mgmt-vendors.js", "./public/system/build/mgmt.js"],
          dest: "./public/system/build/min/mgmt-bundle.min.js"
        },
        app3d: {
          src: [ 
            "./public/system/lib/js/underscore/underscore-min.js",
            "./public/system/lib/js/axios/axios.js",
            "./public/system/lib/js/greensock/minified/TweenLite.min.js",
            "./public/system/lib/js/greensock/minified/plugins/ScrollToPlugin.min.js",
            "./public/system/lib/js/three/three.min.js",
            "./public/system/lib/js/three/Detector.js",
            "./public/system/lib/js/three/controls/OrbitControls.js",
            "./public/system/lib/js/three/loaders/MTLLoader.js",
            "./public/system/lib/js/three/loaders/OBJLoader.js",
            "./public/system/build/app3d.js"
            ],
          dest: "./public/system/build/min/app3d.min.js"
        }
      },
      less: {
        compileCore: {
          options: {
            strictMath: true,
            sourceMap: true,
            outputSourceFiles: true,
            sourceMapURL: "bootstrap.css.map",
            sourceMapFilename: "public/resources/css/bootstrap.css.map"
          },
          files: {
            "public/resources/css/bootstrap.css": "public/resources/less/bootstrap/bootstrap.less"
          }
        },
        compileCustom: {
          options: {
            strictMath: true,
            sourceMap: true,
            outputSourceFiles: true,
            sourceMapURL: "app.css.map",
            sourceMapFilename: "public/resources/css/app.css.map"
          },
          files: {
            "public/resources/css/app.css": "public/resources/less/apps.less"
          }
        }
      },
      cssmin: {
        combine: {
          files: {
            "public/resources/css/app.min.css": ["public/resources/css/bootstrap.css", "public/resources/css/app.css"],
            "public/system/css/styles.min.css": ["public/system/css/styles.css"],
          }
        }
      }
   });

   grunt.loadNpmTasks("grunt-contrib-sass");
   grunt.loadNpmTasks("grunt-browserify");
   grunt.loadNpmTasks("grunt-contrib-watch");
   grunt.loadNpmTasks("grunt-contrib-concat");
   grunt.loadNpmTasks("grunt-contrib-uglify");
   grunt.loadNpmTasks("grunt-contrib-uglify");
   grunt.loadNpmTasks("grunt-contrib-less");
   grunt.loadNpmTasks("grunt-contrib-cssmin");

   grunt.registerTask("default", ["watch"]);
   grunt.registerTask("dev", ["concat", "uglify:bootstrap", "less:compileCore", "cssmin"]);
   grunt.registerTask("build", ["browserify:dist"]);
   grunt.registerTask("mgmt", ["browserify:mgmt"]);
   grunt.registerTask("mgmtVendor", ["browserify:mgmtVendor"]);
   grunt.registerTask("mgmtMin", ["uglify:mgmt"]);
   
   grunt.registerTask("production", [
     "sass", "cssmin", 
     "browserify:dist", "browserify:mgmt", "browserify:mgmtVendor", 
     "uglify:app3d", "uglify:mgmt"
     ]);
   
};