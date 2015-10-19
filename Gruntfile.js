module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
        'app/**/*.js',
        '!app/assets/js/*js',
        '!app/bower_components/**/*js',
        '!app/components/**/*js',
        '!app/dist/**/*js'
        ],
        dest: 'app/dist/js/app.concat.js'
      }
    },

    sass: {                              // Task 
      dist: {                            // Target 
        options: {                       // Target options 
          sourceMap: true,
          outputStyle: 'compressed'
          // cacheLocation: 'app/assets/.sass-cache',
          // style: 'compressed'
        },
        files: {                         // Dictionary of files 
          'app/dist/css/app.css': 'app/assets/scss/app.scss',       // 'destination': 'source' 
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! app.js <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        preserveComments: false
      },
      build: {
        src: 'app/dist/js/app.concat.js',
        dest: 'app/dist/js/app.min.js'
      }
    },

    jshint: {
      files: [
        'app/**/*.js',
        '!app/assets/js/*js',
        '!app/bower_components/**/*js',
        '!app/components/**/*js',
        '!app/dist/**/*js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
        'public/lib/**/*.js',
        'public/dist/**/*.js'
        ]
      }
    },

    watch: {
      scripts: {
        files: [
          'app/**/*.js',
          '!app/assets/js/*js',
          '!app/bower_components/**/*js',
          '!app/components/**/*js',
          '!app/dist/**/*js'
        ],
        tasks: [
          'jshint',
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'app/assets/scss/*.scss',
        tasks: ['sass']
      }
    },

    "bower-install-simple": {
      options: {
        color: true,
        directory: "app/bower_components"
      },
      "prod": {
        options: {
          production: true
        }
      },
      "dev": {
        options: {
          production: false
        }
      }
    },

    shell: {
      view: {
        command: 'open http://localhost:8000/app',
        options: {
            execOptions: {
                maxBuffer: 500 * 1024 // or Infinity
            }
        }
      },
      server:{
        command: 'npm start'
      }
    }

  });

grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-shell');
grunt.loadNpmTasks('grunt-sass');
grunt.loadNpmTasks("grunt-bower-install-simple");
// grunt.loadNpmTasks('grunt-contrib-sass'); // Removed to used grunt-sass



  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

// grunt.registerTask('server-dev', function (target) {
//   // Running nodejs in a different process and displaying output on the main console
//   var nodemon = grunt.util.spawn({
//    cmd: 'grunt',
//    grunt: true,
//    args: 'nodemon'
//  });
//   nodemon.stdout.pipe(process.stdout);
//   nodemon.stderr.pipe(process.stderr);

//   grunt.task.run([ 'watch' ]);
// });

  grunt.registerTask('default', [
    'watch'
  ]);

  // Compile all sass files
  grunt.registerTask('sass-compile', [
    'sass'
  ]);

  // Create and check file
  grunt.registerTask('build', [
    'jshint',
    'concat',
    'uglify',
    'sass'
  ]);

  // Install all dependencies and create files
  grunt.registerTask('create', [
    'bower-install-simple',
    'build'
  ]);

  // Open the HTML app file
  grunt.registerTask('view', function () {
    grunt.task.run([ 'shell:view' ]);
  });

  // Start local server
  grunt.registerTask('server', function () {
    grunt.task.run([ 'shell:server' ]);
  });

  // grunt.registerTask('upload', function(n) {
  //   if(grunt.option('prod')) {
  //     // add your production server task here
  //     grunt.task.run([ 'shell' ]);
  //   } else {
  //     grunt.task.run([ 'server-dev' ]);
  //   }
  // });

  // grunt.registerTask('deploy', [
  //   // add your deploy tasks here
  //   'test', 'build', 'upload'
  // ]);

};