define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery');

    function Loader(options) {
        this.options = options;
        this.isLoading = false;
    }

    Loader.prototype = {
        constructor: Loader,

        success: function (element) {
            var that = this;
            element.setAttribute('data-lazyload-state', 'complete');
            that.isLoading = false;
            that.options.success && that.options.success(element);
        },

        fail: function (element) {
            var that = this;
            // pop图片，不再加载
            that.isLoading = false;
            element.setAttribute('data-lazyload-state', 'error');
            that.options.fail && that.options.fail(element);
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

            $(element).one('load', $.proxy(this.success, this, element)).
                one('error abort', $.proxy(this.fail, this, element));

            element.src = src;
        }
    };

    module.exports = Loader;
});
