module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: 'public/client/*.js',
        dest: 'public/dist/app.concat.js'
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
          'app/assets/css/app.css': 'app/assets/scss/app.scss',       // 'destination': 'source' 
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! app.js <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'public/dist/app.concat.js',
        dest: 'public/dist/app.min.js'
      }
    },

    jshint: {
      files: [
      'public/client/*.js'
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
        'public/client/**/*.js',
        'public/lib/**/*.js',
        ],
        tasks: [
        'concat',
        'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {

      'git-add-dist' : {
        command: 'git add .'
      },
      'git-commit-build' : {
        command: 'git commit -m "build"'
      },
      'heroku' : {
        command: 'git push heroku master'
      }
      
    }
  });

grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-shell');
grunt.loadNpmTasks('grunt-sass');
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

  grunt.registerTask('sass-compile', [
    'sass'
  ]);

  grunt.registerTask('default', [
    'sass'
  ]);

  grunt.registerTask('build', [
    'jshint', 'concat', 'uglify', 'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
      grunt.task.run([ 'shell' ]);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    // add your deploy tasks here
    'test', 'build', 'upload'
  ]);

};