module.exports = {
    options: {
        staticRoot: '/img/mg/dist/',
        pathRoot: '.build/',
        map: '.build/assets.json'
    },
    project: {
        expand: true,
        cwd: '.build/project/',
        src: '**/*.css',
        dest: '.build/project/'
    }
};
