(function (global, seajs, bui) {
    'use strict';

    var alias = {
            'jquery': 'lib/jquery/1.11.2/jquery',
            'hogan': 'lib/hogan/3.0.2/hogan',
            'ueditor': 'lib/ueditor/1.4.3/ueditor.all'
        },
        base;

    /*
     * 匹配以下形式
     * ?dev
     * ?dev=***
     * &dev
     * &dev=
     * 不匹配以下形式
     * ?dev****
     * &dev****
     */
    /*
    if (/(?:\?|\&)dev(?:=|&|$)/.test(location.href)) {

        //base = seajs.data.base.replace('concat/', 'img/mg/dist/');

        seajs.config({
            alias: alias,
            map: [
                [/\-debug\.js$|\.js$/, '-debug.js']
            ],
            comboSyntax: ['??/img/mg/dist/', ',/img/mg/dist/'],
            comboBase: seajs.data.base
        });

    } else {

        seajs.config({
            alias: alias,
            comboSyntax: ['??/img/mg/dist/', ',/img/mg/dist/'],
            comboBase: seajs.data.base
        });

    }
    */
    seajs.config({
        alias: alias,
        base: 'http://localhost:3001/',
        comboSyntax: ['concat/??', ','],
        comboBase: seajs.data.base
    });

}(this, this.seajs, this.bui));
