var grunt = require('grunt'),
    path = require('path');

module.exports = {
    project2Build: {
        files: [{
            expand: true,
            cwd: 'src/project/',
            src: '**/*.less',
            dest: '.build/project/',
            filter: 'isFile',
            rename: function (dest, src, options) {
                src = src.replace('/less/', '/css/');
                src = src.replace(/\.less$/, '.css');
                return path.join(dest, src);
            }
        }]
    }
};
