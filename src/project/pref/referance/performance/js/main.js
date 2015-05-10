(function (global, document) {
    'use strict';

    var tc;

    if (!global.msPerformance &&
            !global.webkitPerformance &&
            !global.performance) {

        tc = document.getElementById('timingChart');
        tc.innerHTML = '您的浏览器不支持W3C Navigation Timing接口。';
        return;
    }

    function getPerformance() {
        if (!!global.performance) {
            return global.performance;
        }

        if (!!global.msPerformance) {
            return global.msPerformance;
        }

        if (!!global.webkitPerformance) {
            return global.webkitPerformance;
        }

        throw new Error('Do not support W3C Navigation Timing Interface');
    }

    global.addEventListener('load', function () {
        global.setTimeout(function () {
            var performance = getPerformance(),
                perf = new global.Perf(performance),
                phase = perf.getPhase(),
                range = perf.getRange();

            global.chart.showTimingChart("Time Phases", phase, range);

            global.table.showDataTable(performance.navigation,
                document.getElementById('navigation-container'));
            global.table.showDataTable(performance.timing,
                document.getElementById('timing-container'));
        }, 100);
    }, false);
}(this, this.document));
