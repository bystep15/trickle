module.exports = {
    options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 8
    },

    project: {
        src: ['dist/project/**/*.{jpg,jpeg,gif,png,webp}', 'dist/project/*.{svg,woff,eot,ttf}']
    }
};
