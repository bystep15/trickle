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

    function format(fmt, timestamp) {
        if (typeof timestamp !== 'number') {
            timestamp = Number(timestamp);
        }

        if (Number.isNaN(timestamp) || timestamp < 0) {
            throw new Error('timestamp 参数错误');
        }

        var date = new Date(timestamp),
            weekday = [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
            ];
        switch(fmt) {
        case 'S':
            var suffix = {
                '1': 'st',
                '2': 'nd',
                '3': 'rd'
            };
            return suffix[format('d', timestamp)[1]] || 'th';
        case 'j':
            return String(date.getDate());
        case 'd':
            return pad(date.getDate());
        case 'D':
            return weekday[date.getDay()].substr(0, 3);
        case 'l':
            return weekday[date.getDay()];
        case 'N':
            if (date.getDay() === 0) {
                return '7';
            }
            return String(date.getDay());
        }
    }
    module.exports = format;
});
