'use strict';
var fs = require('fs');
var path = require('path');

module.exports = function (grunt, files) {

    files.forEach(function (file) {
        var content = fs.readFileSync(file, {encoding: 'utf-8'});
        //seajs.use('component/tab/demo/main');
        content = content.replace(/seajs.use\('(.*)'\);/g, function (seajs, src){ 

            var base = path.basename(src),
                dir = path.dirname(src),
                list = fs.readdirSync(path.join('dist', dir)),
                re = new RegExp(base + '-'),
                dist;

            list.forEach(function (item) {
                if (grunt.file.isFile(path.join('dist', dir, item)) && re.test(item)) {
                    dist = path.join(dir, item);
                }
            });

            grunt.log.writeln('File ' + src + ' replaced.');
            return seajs.replace(src, dist);
        });

        fs.writeFileSync(file, content, {encoding: 'utf-8'});
    });
};
