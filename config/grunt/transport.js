var grunt = require('grunt');

module.exports = {

    options: {
        paths: ['src'],
        alias: {
            'jquery': 'lib/jquery/1.11.2/jquery',
            'hogan': 'lib/hogan/3.0.2/hogan'
        },
        debug:false
    },

    lib2Build: {
        files: [{
            expand: true,
            cwd: 'src',
            src: [
                'lib/**/**/*.js'
            ],
            dest: '.build',
            filter: function (filepath) {
                var isFile = grunt.file.isFile(filepath),
                    isSeaJs = grunt.file.isMatch(['**/seajs*/**/*'], filepath);

                return isFile && !isSeaJs;
            }
        }]
    },

    project2Build: {
        options: {
            hash: true
        },
        files: [{
            expand: true,
            cwd: 'src/project/',
            src: [
                '**/*',
                '!**/test/**/*'
            ],
            dest: '.build/project/',
            filter: 'isFile'
        }]
    }
};
