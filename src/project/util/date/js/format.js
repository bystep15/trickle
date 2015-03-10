/**
 * string format(string $format [, int $timestamp ]);
 * 返回将整数 timestamp 按照给定的格式字串而产生的字符串
 * 参考http://php.net/manual/zh/function.date.php
 * 针对1970年以后的日期有效
 */
define(function (require, exports, module) {

    function pad(value) {
        if (value < 10) {
            return '0' + value;
        }
        return String(value);
    }

    var weekday = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    var month = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    var formator = {
        S: function (date) {
            var suffix = {
                '1': 'st',
                '2': 'nd',
                '3': 'rd'
            };
            return suffix[format('d', date.getTime())[1]] || 'th';
        },

        j: function (date) {
            return String(date.getDate());
        },

        d: function (date) {
            return pad(date.getDate());
        },

        D: function (date) {
            return weekday[date.getDay()].substr(0, 3);
        },

        l: function (date) {
            return weekday[date.getDay()];
        },

        N: function (date) {
            if (date.getDay() === 0) {
                return '7';
            }
            return String(date.getDay());
        },

        w: function (date) {
            return String(date.getDay());
        },

        z: function (date) {
            var origin = new Date(date.getTime());
            origin.setMonth(0);
            origin.setDate(1);
            origin.setHours(0);
            origin.setMinutes(0);
            origin.setSeconds(0);
            origin.setMilliseconds(0);
            return String(Math.floor((date.getTime() - origin.getTime()) / (24 * 60 * 60 * 1000)));
        },

        W: function (date) {
            var time = date.getTime(),
                z = Number(format('z', time)),
                N = Number(format('N', time));

            return pad(Math.ceil((z - N) / 7) + 1);
        },

        F: function (date) {
            return month[date.getMonth()];
        },

        M: function (date) {
            return month[date.getMonth()].substr(0, 3);
        },

        m: function (date) {
            return pad(date.getMonth() + 1);
        },

        n: function (date) {
            return String(date.getMonth() + 1);
        },

        t: function (date) {
            var nextMonth = new Date(date.getTime());
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            nextMonth.setDate(1);
            nextMonth.setHours(0);
            nextMonth.setMinutes(0);
            nextMonth.setSeconds(0);
            nextMonth.setMilliseconds(0);
            return String(new Date(nextMonth.getTime() - 1).getDate());
        },

        L: function (date) {
            var year = date.getFullYear();

            if ((year % 4 === 0 && year % 100 !== 0) ||
                    (year % 400 === 0)) {
                return '1';
            }

            return '0';
        },

        o: function (date) {
            return String(date.getFullYear());
        },

        Y: function (date) {
            return String(date.getFullYear());
        },

        y: function (date) {
            return String(date.getFullYear()).substr(2, 2);
        }
    };

    function format(fmt, timestamp) {
        if (typeof timestamp !== 'number') {
            timestamp = Number(timestamp);
        }

        if (Number.isNaN(timestamp) || timestamp < 0) {
            throw new Error('timestamp 参数错误');
        }

        var date = new Date(timestamp);

        if (formator[fmt]) {
            return formator[fmt](date);
        }
    }
    module.exports = format;
});
