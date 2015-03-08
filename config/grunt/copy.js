'use strict';
var grunt = require('grunt');
var fs = require('fs');
var path = require('path');

module.exports = {
    // buildlib相关 开始

    seajs2Dist: {
        expand: true,
        cwd: 'src/lib/',
        src: 'seajs*/**/*',
        dest: 'dist/lib/'
    },

    config2Build: {
        src: 'src/config.js',
        dest: '.build/config.js'
    },

    libDebug2Dist: {
        files: [{
            expand: true,
            cwd: '.build/',
            src: ['**/lib/**/*.js', '!**/*-debug.js'],
            dest: 'dist/',
            ext: '-debug.js',
            extDot: 'last',
            filter: 'isFile'
        }]
    },


    // buildlib 结束

    icon2Build: {
        files: [{
            expand: true,
            cwd: 'src/project/',
            src: ['**/icon/*.png'],
            dest: '.build/project/',
            filter: 'isFile',
            rename: function (dest, src, options) {
                src = src.replace('/less/', '/css/');
                return path.join(dest, src);
            }
        }]
    },

    image2Dist: {
        files: [{
            expand: true,
            cwd: 'src/project/',
            src: ['**/*.{jpg,jpeg,gif,png,webp}', '**/*.{svg,woff,eot,ttf}'],
            dest: 'dist/project/',
            filter: 'isFile',
            rename: function (dest, src, options) {
                src = src.replace('/less/', '/css/');
                return path.join(dest, src);
            }
        }]
    },

    jsDebug2Dist: {
        files: [{
            expand: true,
            cwd: '.build/project/',
            src: ['**/*.js', '!**/*-debug.js'],
            dest: 'dist/project/',
            ext: '-debug.js',
            extDot: 'last',
            filter: 'isFile'
        }]
    }
};
