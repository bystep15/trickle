module.exports = {
    options: {
        report: 'gzip'
    },

    lib2Dist: {
        expand: true,
        cwd: '.build/lib/',
        src: ['**/*.js', '!**/*-debug.js'],
        dest: 'dist/lib/',
        ext: '.js',
        extDot: 'last'
    },

    config2Dist: {
        src: '.build/config.js',
        dest: 'dist/config.js'
    },

    project2Dist: {
        expand: true,
        cwd: '.build/project/',
        src: ['**/*.js', '!**/*-debug.js'],
        dest: 'dist/project/',
        ext: '.js',
        extDot: 'last'
    }
};
