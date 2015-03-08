var grunt = require('grunt');

module.exports = {
    dist: {
        options: {
            noIDs: true
        },
        src: '.build/**/*.css'
    }
};
