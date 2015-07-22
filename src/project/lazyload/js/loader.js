define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery');

    function Loader(options) {
        this.options = options;
        this.isLoading = false;
    }

    Loader.prototype = {
        constructor: Loader,

        render: function (element, src) {
            element.setAttribute('data-lazyload-state', 'complete');
            element.src = src;
        },

        load: function (element) {
            var that = this,
                state = element.getAttribute('data-lazyload-state'),
                src = element.getAttribute('data-lazyload-original');

            if (state !== 'interactive') {
                return;
            }

            this.isLoading = true;

            element.setAttribute('data-lazyload-state', 'loading');

            element.onload = function () {
                // 渲染图片
                that.render(element, src);
                that.isLoading = false;
                setTimeout(function () {
                    that.options.success && that.options.success(element, src);
                }, 0);
                element.onerror = element.onabort = element.onload = undefined;
            };

            element.onerror = element.onabort = function () {
                // pop图片，不再加载
                that.isLoading = false;
                that.options.fail && that.options.fail(element, src);
                element.onerror = element.onabort = element.onload = undefined;
            };

            element.src = src;
        }
    };

    module.exports = Loader;
});
