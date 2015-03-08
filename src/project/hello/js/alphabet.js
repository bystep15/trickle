define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        Hogan = require('hogan');

    function Alphabet(container) {
        var tpl = require('../tpl/alphabet.tpl');
        this.$container = $(container);
        this.template = Hogan.compile(tpl);
    }

    module.exports = Alphabet;

    Alphabet.prototype = {
        constructor: Alphabet,

        render: function () {
            var data = require('../data/alphabet.json'),
                html = this.template.render({urls: data});
            this.$container.html(html);
        }
    };
});
