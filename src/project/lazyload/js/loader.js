define(function (require, exports, module) {
    'use strict';

    function Loader(options) {
        this.options = options;
    }

    Loader.prototype = {
        constructor: Loader,

        div: function (element, src) {
            element.style.backgroundImage = 'url(' + src + ')';
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

        load: function (element, src) {
            var that = this,
                state = element.getAttribute('data-lazyload-state');
                image;

            if (state !== 'interactive') {
                return;
            }

            element.setAttribute('data-lazyload-state', 'loading');

            image = new Image();

            image.onload = function () {
                // 渲染图片
                that.render(element, src);
                that.options.success && that.options.success(element, src);
            };

            image.onerror = image.onabort = function () {
                // pop图片，不再加载
                that.options.fail && that.options.fail(element, src);
            };

            image.src = src;
        }
    };

    module.exports = Loader;
});
