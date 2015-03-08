module.exports = function (grunt) {
    'use strict';

    // 强制试用Unix 换行符
    grunt.util.linefeed = '\n';

    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Task configuration.
        clean: require('./config/grunt/clean'),
        less: require('./config/grunt/less'),
        copy: require('./config/grunt/copy'),
        sprite: require('./config/grunt/sprite'),
        css_url_replace: require('./config/grunt/url-replace'),
        cssmin: require('./config/grunt/cssmin'),
        csslint: require('./config/grunt/csslint'),
        recess: require('./config/grunt/recess'),
        jslint: require('./config/grunt/jslint'),
        filerev: require('./config/grunt/filerev'),
        filerev_assets: require('./config/grunt/assets'),
        transport: require('./config/grunt/transport'),
        uglify: require('./config/grunt/uglify'),
        //autoprefixer: require('./config/grunt/autoprefixer'),
        connect: require('./config/grunt/connect'),
        watch: require('./config/grunt/watch'),
        makeMap: {
            normal: {
                options: {
                    rootDir: 'dist/',
                    projectSrc: '<%= projectSrc %>/js/',
                    files: ['**/*main*',"!**/*-debug.js"],
                    dest:'seajs_config.js'
                }
            }
        }
        //jscs: {},
        //csscomb: {},
    });

    // These plugins provide necessary tasks.
    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

    grunt.registerTask('seajs-replace', 'Update JS Referance', function () {
        var replace = require('./config/grunt/seajs-replace.js'),
            files = Object.keys(grunt.config.get('concat.doc.files'));

        replace(grunt, files);
    });

    /**
     * Lib编译
     * 1. 清除dist和.build目录中的lib目录
     * 2. lib目录中css压缩
     *    dev/lib -> dist/lib
     * 3. 转义lib文件为线上版本
     *    dev/lib -> .build/lib
     * 6. 拷贝配置文件
     *    dev/config.js -> .build/config.js
     * 7. 拷贝SeaJs相关文件
     *    dev/lib/seajs* -> dist/lib/seajs*
     * 8. 将转义完成的js文件拷贝debug版本
     *    .build/.js -> dist/-debug.js
     * 10. 将转义完成的js文件压缩
     *    .build/lib/*.js -> dist/lib/*.js
     * 11. 将转义完成的js文件压缩
     *    .build/config.js -> dist/config.js
     * 12. 将lib和config.js拷贝到baby或baby-img库
     */
    grunt.registerTask('buildlib', [
        'clean:lib',
        'cssmin:lib2Dist',
        'transport:lib2Build',
        'copy:config2Build',
        'copy:seajs2Dist',
        'copy:libDebug2Dist',
        'uglify:lib2Dist',
        'uglify:config2Dist'
    ]);

    /**
     * CSS编译(grunt:buildcss)
     * 1. clean所有css目录
     * clean:css(dist和.build目录中css文件夹下所有资源)
     * 2. lessc
     * less:project2Build(src中less目录 -> .build中css目录，不要map文件)
     * 3. copy image 
     * src -> dist
     * 4. copy icon
     * icon/*.png -> .build
     * 4. sprite
     * sprite:index(css文件更新，精灵图.build -> dist)
     * 5. filerev
     * 将图片文件Hash化
     * 6. filerev_assets
     * 生成静态资源列表
     * 7. replace
     * replace(当前文件更新)
     * 8. csslint
     * 出现错误，立刻中止
     * 9. recess(暂时去掉)
     * 出现错误，立刻中止
     * 10. min
     * .build -> dist
     * 11. 拷贝到baby库
     */
    grunt.registerTask('buildcss', [
        'clean:projectcss',
        'less:project2Build',
        'copy:image2Dist',
        'copy:icon2Build',
        'sprite', // 执行自动生成的sprite project任务
        'filerev:project',
        'filerev_assets:project',
        'css_url_replace:project',
        'csslint:project',
        'cssmin:project2Dist'
    ]);

    /**
     * JS编译(grunt:buildjs)
     * 1. JsLint
     * 出现错误，立刻中止
     * 2. clean所有js目录
     * clean:js(dist和.build目录中js文件夹下所有资源)
     * 3. 转义SeaJs文件为线上版本
     * src -> .build
     * 4. Copy Debug版本JS
     * .build -> dist
     * 5. Min(uglify)
     * .build -> dist
     * 6. 拷贝到baby库
     */
    grunt.registerTask('buildjs', [
        'jslint:project',
        'clean:projectjs',
        'transport:project2Build',
        'copy:jsDebug2Dist',
        'uglify:project2Dist'
    ]);

    /*
     * 默认处理
     * 1. clean:all
     * 2. buildlib
     * 3. buildcss
     * 4. buildjs
     */
    grunt.registerTask('default', '默认处理，会把所有的项目都编译一遍', [
        'clean:all',
        'buildlib',
        'buildcss',
        'buildjs'
    ]);

    /**
     * 启动本地服务器
     */
    grunt.registerTask('serve', ['connect', 'watch']);
};
