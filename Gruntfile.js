module.exports = function(grunt) {

  /**
   * BUILD CONFIGURATION
   */
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      production: {
        files: [
          {
            src: 'index.js',
            dest: 'dist/neodymium.min-v<%pkg.version%>.js'
          }
        ],
        options: {
          browserifyOptions: {
            transforms: [ 'uglifyify' ],
            standalone: 'neodymium'
          }
        }
      },
      development: {
        files: [
          {
            src: 'index.js',
            dest: 'dist/neodymium.js'
          }
        ],
        options: {
          watch: true,
          keepAlive: true,
          browserifyOptions: {
            standalone: 'neodymium',
            debug: true
          }
        }
      }
    },
    clean: {
      production: {
        src: [ 'dist/*' ]
      }
    }
  });

  /**
   * TASKS
   */
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('develop', [ 'browserify:development' ]);
  grunt.registerTask('build', [ 'browserify:production' ]);

  grunt.registerTask('default', [ 'build' ]);
};
