/**
 * string format(string $format [, int $timestamp ]);
 * 返回将整数 timestamp 按照给定的格式字串而产生的字符串
 * 参考http://php.net/manual/zh/function.date.php
 */
define(function (require, exports, module) {

    function pad(value) {
        console.log(value);
        if (value < 10) {
            return '0' + value;
        }
        return String(value);
    }

    function format(fmt, timestamp) {
        var date = new Date(timestamp);
        return pad(date.getDate());
    }
    module.exports = format;
});
