module.exports = function (grunt) {
  
  'use strict';

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
    '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
    '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
    ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration
    clean: {
      files: ['dist']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['bower_components/requirejs/require.js', '<%= concat.dist.dest %>'],
        dest: 'dist/campusmap.js'
      }
    },
    compass: {
        options: {
            sassDir: 'app/styles',
            cssDir: '.tmp/styles',
            imagesDir: 'app/images',
            javascriptsDir: 'app/scripts',
            fontsDir: 'app/styles/fonts',
            importPath: 'bower_components',
            relativeAssets: true
        },
        dist: {},
        server: {
            options: {
                debugInfo: true
            }
        }
    },
    uglify: {
      options: {
        banner: '<%= banner %>',
        report: 'gzip'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/campusmap.min.js'
      }
    }, 
    jasmine: {
      test: {
        src: ['app/**/*.js', '!app/main.js'],
        options: {
          specs: 'test/**/*Spec.js', //
          helpers: 'test/**/*Helper.js',
          vendor: 'bower_components/modernizr/modernizr.js',
          keepRunner: true,
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
            requireConfigFile: 'app/main.js', 
            requireConfig: {
              baseUrl: 'app/'
            }
          }
        }
      }
    },
    jst: {
        options: {
            amd: true 
        },
        compile: {
            files: {
                '.tmp/scripts/templates.js': ['app/scripts/templates/**/*.ejs']
            }
        }
    },
    jshint: {
      app: { 
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['app/**/*.js', 'Gruntfile.js']
      }
    },
    watch: {
/*    gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile']
      },*/
      src: {
        files: ['app/**/*.js'],
        tasks: ['jshint:src', 'jasmine']
      },
      test: {
        files: ['test/**/*.js'],
        tasks: ['jshint:test', 'jasmine']
      },
      compass: {
        files: ['app/**/*.scss'],
        tasks: ['compass:dist']
      }
    },
    requirejs: {
      compile: {
        options: {
          name: 'widget',
          mainConfigFile: 'app/main.js',
          out: '<%= concat.dist.dest %>'
          , optimize: 'none'
          , paths: []
        }
      }
    },
    connect: {
      development: {
        options: {
          keepalive: true
        }
      },
      production: {
        options: {
          keepalive: true,
          //port: 80,
          //host: '0.0.0.0',
          middleware: function (connect, options) {
            return [
              // rewrite requirejs to the compiled version
              function (req, res, next) {
                if (req.url === '/bower_components/requirejs/require.js') {
                  req.url = '/dist/campusmap.min.js';
                }
                next();
              },
              connect.static(options.base),

              ];
            }
          }
        }
      }
    });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-compass');

  grunt.registerTask('createDefaultTemplate', function () {
      grunt.file.write('.tmp/scripts/templates.js', 'this.JST = this.JST || {};');
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'jasmine', 'clean', 'createDefaultTemplate', 'jst', 'compass:dist', 'requirejs', 'concat', 'uglify']);
  grunt.registerTask('build', ['requirejs', 'concat', 'uglify']);
  grunt.registerTask('server', ['connect:development']);
  grunt.registerTask('server:prod', ['connect:production']);
  grunt.registerTask('test', ['createDefaultTemplate', 'jst', 'jasmine', 'clean', 'compass:dist']);

};
