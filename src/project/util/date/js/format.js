/**
 * string format(string $format [, int $timestamp ]);
 * 返回将整数 timestamp 按照给定的格式字串而产生的字符串
 * 参考http://php.net/manual/zh/function.date.php
 * 针对1970年以后的日期有效
 */
define(function (require, exports, module) {
    'use strict';

    var formator;

    function pad(value) {
        if (typeof value === 'string') {
            if (value.length === 1) {
                return '0' + value;
            }
        }

        if (typeof value === 'number') {
            if (value < 10) {
                return '0' + value;
            }
            return String(value);
        }

        return value;
    }

    function format(fmt, timestamp) {
        var date,
            result,
            i;

        if (typeof timestamp !== 'number') {
            timestamp = Number(timestamp);
        }

        if (timestamp instanceof Date) {
            date = timestamp;
        } else if (typeof timestamp === 'number') {
            if (Number.isNaN(timestamp) || timestamp < 0) {
                throw new Error('timestamp 参数错误');
            }
            date = new Date(timestamp);
        }

        if (fmt.length > 1) {
            result = [];
            for (i = fmt.length - 1; i >= 0; i -= 1) {
                result.unshift(format(fmt[i], date));
            }

            return result.join('');
        }

        if (typeof formator[fmt] === 'function') {
            return formator[fmt](date);
        }

        if (typeof formator[fmt] === 'string') {
            return format(formator[fmt], date);
        }

        return fmt;
    }

    formator = {
        S: function (date) {
            var suffix = {
                '1': 'st',
                '2': 'nd',
                '3': 'rd'
            };
            return suffix[format('d', date)[1]] || 'th';
        },

        j: function (date) {
            return String(date.getDate());
        },

        d: function (date) {
            return pad(date.getDate());
        },

        D: function (date) {
            return format('l', date).substr(0, 3);
        },

        l: function (date) {
            var weekday = [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
            ];

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

            return month[date.getMonth()];
        },

        M: function (date) {
            return format('F', date).substr(0, 3);
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
        },

        a: function (date) {
            if (date.getHours() < 12) {
                return 'am';
            }
            return 'pm';
        },

        A: function (date) {
            return format('a', date).toUpperCase();
        },

        // http://zh.wikipedia.org/wiki/Swatch網際網路時間
        B: function (date) {
            // 所在时区与UTC+1的时差
            // 将UTC+8换算成Beat时，上述x以7代入
            var x = 7,
                // 所在时区的小时(24时制)
                h = date.getHours(),
                // 所在时区的分钟
                m = date.getMinutes(),
                // 所在时区的秒数
                s = date.getSeconds(),
                // 如果(h-x)为负值，可+24转为正值
                beat = 1000 * (60 * (60 * ((h - x + 24) % 24) + m) + s) / 86400;
            return String(Math.floor(beat));
        },
        g: function (date) {
            var hour = date.getHours();

            hour = hour % 12;

            return String(hour || 12);
        },

        G: function (date) {
            return String(date.getHours());
        },

        h: function (date) {
            return pad(format('g', date));
        },

        H: function (date) {
            return pad(date.getHours());
        },

        i: function (date) {
            return pad(date.getMinutes());
        },

        s: function (date) {
            return pad(date.getSeconds());
        },

        e: function (date) {
            return 'GMT';
        },

        O: function (date) {
            var offset = date.getTimezoneOffset() / 60,
                prefix = '-';

            if (offset < 0) {
                prefix = '+';
                offset = -offset;
            }

            return prefix + pad(Math.floor(offset)) + '00';
        },

        P: function (date) {
            var offset = date.getTimezoneOffset(),
                prefix = '-',
                hour,
                minute;

            if (offset < 0) {
                offset = -offset;
                prefix = '+';
            }

            hour = pad(Math.floor(offset / 60));
            minute = pad(offset % 60);

            return prefix + hour + ':' + minute;
        },

        // 2018-05-09T22:28:22+08:00
        c: 'Y-m-dTH:i:sP',

        r: 'D, d M Y H:i:s O',

        U: function (date) {
            return String(Math.floor(date.getTime() / 1000));
        }
    };

    module.exports = format;
});
