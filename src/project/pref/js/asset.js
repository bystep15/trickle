define(function (require, exports, module) {
    'use strict';

    var global = window;

    function Asset(url, key) {
        if (!url && !key) {
            throw new Error('请传入完整的url和key参数');
        }
        this.url = url;
        this.key = key;
    }

    Asset.prototype = {
        constructor: Asset,

        // 采样比例
        ratio: 10,

        getPerformance: function () {
            if (!!global.performance) {
                return global.performance;
            }

            if (!!global.msPerformance) {
                return global.msPerformance;
            }

            if (!!global.webkitPerformance) {
                return global.webkitPerformance;
            }

            return null;
        },

        getEntries: function (performance) {
            return performance.getEntriesByType('resource');
        },

        getSampling: function (entries) {
            return entries.sort(this.compare)[0];
        },

        stringify: function (sampling) {
            return JSON.stringify(sampling);
        },

        compare: function (entry1, entry2) {
            return entry2.duration - entry1.duration;
        },

        param: function (url, key, value) {
            if (url.indexOf('?') >= 0) {
                url += '&';
            } else {
                url += '?';
            }

            url += encodeURIComponent(key) + '=' + encodeURIComponent(value);

            return url;
        },

        isLucky: function () {
            return Math.ceil(Math.random() * 100) <= this.ratio;
        },

        log: function () {
            var performance,
                entries,
                sampling,
                image;

            if (!this.isLucky()) {
                return;
            }

            performance = this.getPerformance();

            if (!performance) {
                return;
            }

            entries = this.getEntries(performance);
            sampling = this.getSampling(entries);

            if (sampling) {
                image = new Image();
                image.url = this.param(this.url, this.key, sampling);
            }
        }
    };

    module.exports = Asset;
});
