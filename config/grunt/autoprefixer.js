module.exports = {
    options: {
        browsers: {
            "Android 2.3",
            "Android >= 4",
            "Chrome >= 20",
            "Firefox >= 24",
            "Explorer >= 8",
            "iOS >= 6",
            "Opera >= 12",
            "Safari >= 6"
        }
    },
    core: {
        options: {
            map: true
        },
        src: 'dist/css/<%= pkg.name %>.css'
    },
    theme: {
        options: {
            map: true
        },
        src: 'dist/css/<%= pkg.name %>-theme.css'
    },
    docs: {
        src: 'docs/assets/css/src/docs.css'
    },
    examples: {
        expand: true,
        cwd: 'docs/examples/',
        src: ['**/*.css'],
        dest: 'docs/examples/'
    }
};
