define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery');

    function Loader(options) {
        this.options = options;
        this.isLoading = false;
    }

    Loader.prototype = {
        constructor: Loader,

        div: function (element, src) {
            //$(element).css('opacity', 0.5).animate({opacity: 1}, 400);
            element.style.backgroundImage = 'url("' + src + '")';
        },

        img: function (element, src) {
            element.src = src;
        },

        render: function (element, src) {
            element.setAttribute('data-lazyload-state', 'complete');

            if (element.nodeName === 'IMG') {
                this.img(element, src);
            } else {
                this.div(element, src);
            }
        },

        load: function (element) {
            var that = this,
                state = element.getAttribute('data-lazyload-state'),
                src = element.getAttribute('data-lazyload-original'),
                image;

            if (state !== 'interactive') {
                return;
            }

            this.isLoading = true;

            element.setAttribute('data-lazyload-state', 'loading');

            image = new Image();

            image.onload = function () {
                // 渲染图片
                that.render(element, src);
                that.isLoading = false;
                setTimeout(function () {
                    that.options.success && that.options.success(element, src);
                }, 0);
            };

            image.onerror = image.onabort = function () {
                // pop图片，不再加载
                that.isLoading = false;
                that.options.fail && that.options.fail(element, src);
            };

            image.src = src;
        }
    };

    module.exports = Loader;
});
