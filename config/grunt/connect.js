var fs = require('fs'),
    path = require('path');

module.exports = {
    dev: {
        options: {
            port: 2999,
            base: ['src']
        }
    },
    site: {
        options: {
            port: 3000,
            base: ['dist']
        }
    },
    combo: {
        options: {
            port: 3001,
            base: ['dist'],
            middleware: function (connect, options, middlewares) {
                middlewares.unshift(function (req, res, next) {
                    if (!/^\/concat\/?\?\?(.+)$/.test(req.url)) {
                        return next();
                    }

                    var files = RegExp.$1.split(',');

                    files.forEach(function (file) {
                        if (file) {
                            file = path.join('dist', file);
                            res.write(fs.readFileSync(file));
                            res.write('\n');
                        }
                    });

                    res.end('/* Combo Server Running!*/');
                });

                return middlewares;
            }
        }
    }
};
