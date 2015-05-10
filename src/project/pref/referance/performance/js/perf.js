(function (global) {
    'use strict';

    function Perf(performance) {
        this.performance = performance;
        this.timing = this.performance.timing;
    }

    Perf.prototype = {
        constructor: Perf,

        getMeasures: function () {
            var timing = this.performance.timing,
                measures = {};

            if (timing.domContentLoadedEventStart !== undefined) {
                measures.navigation = (timing.loadEventEnd -
                    timing.navigationStart);
                measures.unloadEvent = (timing.unloadEventEnd -
                    timing.unloadEventStart);
                measures.redirect = (timing.redirectEnd - timing.redirectStart);
                measures.domainLookup = (timing.domainLookupEnd -
                    timing.domainLookupStart);
                measures.connect = (timing.connectEnd - timing.connectStart);
                measures.request = (timing.responseStart - timing.requestStart);
                measures.response = (timing.responseEnd - timing.responseStart);
                measures.domLoading = (timing.domInteractive -
                    timing.domLoading);
                measures.domInteractive = (timing.domContentLoadedEventEnd -
                    timing.domInteractive);
                measures.domContentLoaded = (timing.domContentLoadedEventEnd -
                    timing.domContentLoadedEventStart);
                measures.domComplete = (timing.domComplete - timing.domLoading);
                measures.loadEvent = (timing.loadEventEnd -
                    timing.loadEventStart);
                measures.fetch = (timing.responseEnd - timing.fetchStart);
                measures.firstPaint = (timing.firstPaint -
                    timing.navigationStart);
            }

            return measures;
        },

        getStartTime: function (name) {
            var timing = this.timing,
                origin = timing.navigationStart;
            return Math.max(timing[name] - origin, 0);
        },

        getStartTimes: function () {
            var times = {};

            times.navigation = this.getStartTime('navigationStart');
            times.unloadEvent = this.getStartTime('unloadEventStart');
            times.redirect = this.getStartTime('redirectStart');
            times.domainLookup = this.getStartTime('domainLookupStart');
            times.connect = this.getStartTime('connectStart');
            times.request = this.getStartTime('requestStart');
            times.response = this.getStartTime('responseStart');
            times.domLoading = this.getStartTime('domLoading');
            times.domInteractive = this.getStartTime('domInteractive');
            times.domContentLoaded = this.getStartTime('loadEventStart');
            times.domComplete = this.getStartTime('domLoading');
            times.loadEvent = this.getStartTime('loadEventEnd');
            times.fetch = this.getStartTime('fetchStart');

            return times;
        },

        getRange: function () {
            var performance = this.performance,
                timing = performance.timing,
                result = 0,
                i;

            for (i in timing) {
                if (timing.hasOwnProperty(i)) {
                    result = Math.max(result, timing[i]);
                }
            }
            return result - timing.navigationStart;
        },

        getPhase: function () {
            var measures = this.getMeasures(),
                starts = this.getStartTimes(),
                measureName,
                result,
                results = [];

            for (measureName in measures) {
                if (measures.hasOwnProperty(measureName) &&
                        starts.hasOwnProperty(measureName)) {

                    result = {
                        name: measureName,
                        elapsed: measures[measureName],
                        startTime: starts[measureName]
                    };

                    results.push(result);
                }
            }

            return results;
        }
    };

    global.Perf = Perf;
}(this));
