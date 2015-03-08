module.exports = {

    options: {
        report: 'gzip'
    },

    /**
     * 将lib库中css文件直接压缩到dist目录
     * 减少磁盘IO，一步到位
     */
    lib2Dist: {
        expand: true,
        cwd: 'src/lib/',
        src: ['**/*.css'],
        dest: 'dist/lib/',
        ext: '.css'
    },

    project2Dist: {
        expand: true,
        cwd: '.build/project/',
        src: ['**/*.css'],
        dest: 'dist/project/',
        ext: '.css'
    }
};
