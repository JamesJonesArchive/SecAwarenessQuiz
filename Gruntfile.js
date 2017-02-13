// Generated on 2015-02-03 using generator-angular-php 0.6.2
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);
  
  // grunt-connect-proxy middleware to serve PHP
  var proxyMiddleware = function (connect, options) {
    var middlewares = [];
    var directory = options.directory || options.base[options.base.length - 1];
    if (!Array.isArray(options.base)) {
      options.base = [options.base];
    }

    // Setup the proxy
    middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);

    options.base.forEach(function(base) {
      // Serve static files.
      middlewares.push(connect.static(base));
    });

    // Make directory browse-able.
    middlewares.push(connect.directory(directory));

    return middlewares;
  };

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist',
    public: 'public',
    name: require('./package.json').name,
    version: require('./package.json').version,
    release: require('./package.json').release,
    description: require('./package.json').description,
    homepage: require('./package.json').homepage,
    license: require('./package.json').license
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['<%= yeoman.app %>/tests/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/api/{,{config,src,tests}/**/}/*',
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      },
      phpTest: {
        files: ['<%= yeoman.app %>/api/{,{config,src,tests}/**/}/*'],
        tasks: ['phpunit']
      },
      composer_json: {
        files: [ 
            '<%= yeoman.app %>/api/composer.json', 
            '<%= yeoman.app %>/api/composer.lock' 
        ],
        tasks: [ 'composer:update' ],
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      proxies: [
        {
          context: '/api',
          host: 'localhost',
          port: '<%= php.options.port %>'
        }
      ],
      livereload: {
        options: {
          open: true,
          middleware: function (connect, options) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/app/bower_components',
                connect.static('./app/bower_components')
              ),
              connect.static(appConfig.app)
            ].concat(proxyMiddleware(connect, options));
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect, options) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/app/bower_components',
                connect.static('./app/bower_components')
              ),
              connect.static(appConfig.app)
            ].concat(proxyMiddleware(connect, options));
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>',
          middleware: proxyMiddleware
        }
      }
    },

    // PHP built-in server
    php: {
      options: {
        port: 8000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '127.0.0.1',
        router: 'api/index.php'

      },
      server: {
        options: {
          base: '<%= yeoman.app %>'
        }
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>'
        }
      }
    },
    phpunit: {
        classes: {
            dir: '<%= yeoman.app %>/api/tests/'
        },
        options: {
            bin: '<%= yeoman.app %>/api/vendor/bin/phpunit',
            configuration: 'phpunit.xml',
            colors: true
        }
    },
    composer: {
        options: {
            usePhp: false,
            cwd: 'app/api'
        }
    },
    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '<%= yeoman.public %>/{,*/}*',
            'build/{,*/}*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    // Zips the dist to a file
    compress: {
        dist: {
            options: {
                archive: '<%= yeoman.public %>/<%= yeoman.name %>.zip'
            },
            files: [
                {
                    expand: true, 
                    dot: true,
                    src : '**', 
                    cwd : '<%= yeoman.dist %>'
                }
            ]
        }
    },
    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      options: {
        cwd: ''
      },
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css',
          '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>','<%= yeoman.dist %>/images']
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // ngmin tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

//    // Replace Google CDN references
//    cdnify: {
//      dist: {
//        html: ['<%= yeoman.dist %>/*.html']
//      }
//    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          src: [
            '**',
            '!bower_components/**',
            '!scripts/**',
            '!styles/**',
            '!tests/**',
            '!api/tests/**',
            '!images/android-icon-*.png',
            '!images/favicon-*.png',
            '!images/apple-icon*.png',
            '!images/ms-icon-*.png'
          ],
          dest: '<%= yeoman.dist %>/'
      },
      dist2: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>',
            src: [
              'api/{{config,src,vendor,components}/**,index.php,saqservices.php,.htaccess}',
              '*.{ico,png,txt}',
              '.htaccess',
              '*.html',
              '*.js',
              'views/{,*/}*.html',
              'images/{,*/}*.{webp}',
              'fonts/*',
              'bower_components/**'
            ]
          }, 
          {
            expand: true,
            cwd: '.tmp/images',
            dest: '<%= yeoman.dist %>/images',
            src: ['generated/*']
          }, 
          {
            expand: true,
            cwd: 'bower_components/bootstrap/dist',
            src: 'fonts/*',
            dest: '<%= yeoman.dist %>'
          }
        ]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      options: {
          limit: 3
      },
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    shell: {
      options: {
        stdout: true,
        stderr: true,
        failOnError: true
      },
      phpTest: {
        command: 'make --directory <%= yeoman.app %>/api tests'
      },
      phpUpdate: {
        command: 'make --directory <%= yeoman.app %>/api update'
      },
      mkpublic: {
        command: 'mkdir -p public'
      },
      mkdist: {
        command: 'mkdir -p dist'
      },
      for_centos7: {
        "command": [
          [
            '/usr/local/bin/fpm -f -s dir -t rpm -n \'<%= yeoman.name %>\' -v <%= yeoman.version %> '
          ].join(' -d '),
          '--description "<%= yeoman.description %>"',
          '--url "<%= yeoman.homepage %>"',
          '--license "<%= yeoman.license %>"',
          '--vendor "University of South Florida"',
          '--iteration "<%= yeoman.release %>".el7',
          '--config-files /usr/local/etc/idm_config/secAwarenessQuiz.yml',
          '-p public ./dist/.=/opt/site/saq ./config/secAwarenessQuiz.yml=/usr/local/etc/idm_config/secAwarenessQuiz.yml'
          ].join(' ')
        }
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'app/tests/karma.conf.js',
        singleRun: true
      }
    }
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run([
        'composer:update',
        'build',
        'configureProxies',
        'php:dist',
        'connect:dist:keepalive'
      ]);
    }

    grunt.task.run([
      'clean:server',
      'composer:update',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'configureProxies',
      'php:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'composer:update',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'phpunit',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'composer:update',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    // 'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin',
    'compress'
  ]);

  grunt.registerTask('dist', [
    'clean:dist',
    'shell:mkpublic',
    'shell:mkdist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'composer:update',
    'newer:jshint'
 //   'test',
 //   'build'
  ]);
};
