define(function (require, exports, module) {
    'use strict';

    var global = window;

    function Asset(url) {
        if (!url) {
            throw new Error('请传入完整的url参数');
        }
        this.url = url;
    }

    Asset.prototype = {
        constructor: Asset,

        // 采样比例
        ratio: 10,

        getPerformance: function () {
            if (!!global.performance) {
                return global.performance;
            }

            if (!!global.webkitPerformance) {
                return global.webkitPerformance;
            }

            if (!!global.msPerformance) {
                return global.msPerformance;
            }

            if (!!global.mozPerformance) {
                return global.mozPerformance;
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

            url += encodeURIComponent(key) + '=' + encodeURIComponent(this.stringify(value));

            return url;
        },

        isLucky: function () {
            return Math.ceil(Math.random() * 100) <= this.ratio;
        },

        log: function () {
            var performance,
                entries,
                sampling,
                image,
                url;

            if (!this.isLucky()) {
                return;
            }

            performance = this.getPerformance();

            if (!performance) {
                return;
            }

            url = this.url;
            url = this.param(url, 't', performance.timing);

            entries = this.getEntries(performance);
            sampling = this.getSampling(entries);

            if (sampling) {
                url = this.param(url, 'p', sampling);
            }

            if (global.navigator.sendBeacon) {
                global.navigator.sendBeacon(url);
            } else {
                image = new global.Image();
                image.url = url;
            }
        }
    };

    module.exports = Asset;
});
