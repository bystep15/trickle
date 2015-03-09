module.exports = {
    js: {
        files: ['src/project/**/*.js'],
        tasks: [/*'buildjs'*/], // 添加test
        options: {
        }
    },

    css: {
        files: ['src/project/**/*.less'],
        tasks: [/*'buildcss'*/],
        options: {
        }
    },

    lib: {
        files: ['src/lib/**/*'],
        tasks: [/*'buildlib'*/],
        options: {
            debounceDelay: 2000
        }
    },
};
