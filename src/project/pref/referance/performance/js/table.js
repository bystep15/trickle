(function (global) {
    'use strict';

    function getType(object) {
        var type = Object.prototype.toString.call(object);

        if (/^\[object\s+([a-zA-Z]+)\]$/.test(type)) {
            return RegExp.$1;
        }

        return '';
    }

    function getUnits(object) {
        var units = '';

        switch (getType(object)) {
        case 'WebkitPerformanceTiming':
        case 'MsPerformanceTiming':
        case 'PerformanceTiming':
            units = ' ms';
            break;
        default:
            break;
        }

        return units;
    }

    function showDataTable(record, container) {
        var navType = ['navigate', 'reload', 'Back/Foward'],
            row,
            result,
            html = '',
            mark,
            type = getType(record),
            unit = getUnits(record);

        for (mark in record) {
            if (record.hasOwnProperty(mark)) {
                result = record[mark];
                result = result === undefined ? 'n/a' : result + unit;

                if (mark === 'type') {
                    result = navType[result];
                }

                row = '<div class="gridcontentrow" ' +
                    'onmouseover="descripHandler(this)" ' +
                    'onmouseout="closeDescrip();" ' +
                    'id="' + mark + '"' +
                    'data-type="' + type + '"' +
                    '">' +
                    '<div class="gridcontent" tabindex="0" ' +
                    'onactivate="descripHandler(this)" ' +
                    'ondeactiavte="closeDescrip();" ' +
                    'id="' + mark + '"' +
                    'data-type="' + type + '"' +
                    '">' +
                    mark +
                    '</div>' +
                    '<div class="gridcontent">' + result + '</div>' +
                    '</div>';

                html += row;
            }
        }

        container.insertAdjacentHTML('beforeend', html);
    }

    global.table = {
        showDataTable: showDataTable
    };
}(this));
