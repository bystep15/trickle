(function (global, document) {
    'use strict';

    var animateBar = [],
        animateBarId = null;

    function createLeftColumn(headerName) {
        return '<div class="leftcontainer">' + headerName + '</div>';
    }

    function createTimeHeaders(maxNumIntervals, interval) {
        var html = '',
            i;

        html += '<div class="container">';
        html +=     '<div class="row">';

        for (i = 0; i < maxNumIntervals; i += 1) {
            html += '<div class="timediv">' + (i * interval) + 'ms</div>';
        }

        html +=     '</div>';
        html += '</div>';

        return html;
    }

    function createHeader(name, maxNumIntervals, interval) {
        var html = '';
        html += '<div class="hrow">';
        html += createLeftColumn(name);
        html += createTimeHeaders(maxNumIntervals, interval);
        html += '</div>';
        return html;
    }

    function addRow(data, scaleBar) {
        var width = 0,
            left = data.startTime * scaleBar,
            elapsed = '',
            html = '',
            animate;

        if (!isNaN(data.elapsed)) {
            width = data.elapsed * scaleBar;
        }

        if (!isNaN(data.elapsed)) {
            elapsed = data.elapsed + 'ms';
        } else {
            elapsed = data.elapsed;
        }

        html += '<div id="' + data.name + '" ' +
            'data-type="timingMeasures" ' +
            'onmouseover="descripHandler(this);" ' +
            'onmouseout="closeDescrip();" ' +
            'class="row">';
        html += '<div id="' + data.name + '" ' +
            'data-type="timingMeasures" ' +
            'onactivate="descripHandler(this);" ' +
            'ondeactivate="closeDescrip();" ' +
            'tabindex="0" ' +
            'class="rowheading">' + data.name + '</div>';
        html += '<div class="barwrapper">';

        html += '<div class="bar" id="bar_' + data.name + '" style="width: 0; left:' + left + 'px;">' + elapsed + '</div>';
        html += '</div>';
        html += '</div>';

        animate = { id: 'bar_' + data.name, barWidth: 0, maxWidth: width };
        animateBar.push(animate);
        return html;
    }

    function animateBars() {
        var done = true,
            item,
            elem,
            i;

        for (i = 0; i < animateBar.length; i += 1) {
            item = animateBar[i];
            elem = document.getElementById(item.id);

            if (item.barWidth < item.maxWidth) {
                done = false;
                item.barWidth = Math.min(item.barWidth + 10,
                        item.maxWidth);
            } else {
                item.barWidth = Math.max(item.barWidth, 1);
            }
            elem.style.width = item.barWidth + 'px';
        }

        if (done) {
            clearInterval(animateBarId);
        }
    }

    function showTimingChart(headerName, data, maxTime) {
        var tc = document.getElementById('timingChart'),
            scaleBar = 1,
            interval,
            html = '',
            maxNumIntervals,
            i;

        if (maxTime < 100) {
            interval = 25;
            scaleBar = 4;
        } else if (maxTime >= 100 && maxTime <= 700) {
            interval = 100;
            scaleBar = 1;
        } else if (maxTime > 700 && maxTime < 3000) {
            interval = 500;
            scaleBar = 0.2;
        } else {
            interval = 1000;
            scaleBar = 0.1;
        }

        maxNumIntervals = Math.round(maxTime / interval) + 2;

        html += '<div class="outercontainer">';
        html += createHeader(headerName, maxNumIntervals, interval);

        for (i = 0; i < data.length; i += 1) {
            html += addRow(data[i], scaleBar);
        }

        html += '</div>';

        tc.insertAdjacentHTML('beforeend', html);

        animateBarId = setInterval(animateBars, 1000.0 / 60.0);
    }

    global.chart = {
        showTimingChart: showTimingChart
    };
}(this, this.document));
