describe('Util date format module test suite', function () {

    // Wed May 09 2018 22:28:22 GMT+0800 (CST)
    var timestamp = 1525876102869;

    it('should throw error when pass timestamp as a error value', function (done) {
        seajs.use('/project/util/date/js/format', function (format) {
            expect('09').toBe(format('d', String(timestamp)));
            expect(function () {
                format('d', -1);
            }).toThrow();
            expect(function () {
                format('d', 'error');
            }).toThrow();
            done();
        });
    });

    it('should return 月份中的第几天(没有前导零) when pass `j`', function (done) {
        seajs.use('/project/util/date/js/format', function (format) {
            expect('9').toBe(format('j', timestamp));
            done();
        });
    });

    it('should return 月份中的第几天(有前导零的2位数字) when pass `d`', function (done) {
        seajs.use('/project/util/date/js/format', function (format) {
            expect('09').toBe(format('d', timestamp));
            done();
        });
    });

    it('should return 星期中的第几天(3 个字母) when pass `D`', function (done) {
        seajs.use('/project/util/date/js/format', function (format) {
            expect('Wed').toBe(format('D', timestamp));
            done();
        });
    });

    it('should return 星期几(完整的文本格式) when pass `l(小写L)`', function (done) {
        seajs.use('/project/util/date/js/format', function (format) {
            expect('Wednesday').toBe(format('l', timestamp));
            done();
        });
    });

    it('should return ISO-8601 格式数字表示的星期中的第几天,1(星期一)到7(星期天) when pass `N`', function (done) {
        seajs.use('/project/util/date/js/format', function (format) {
            expect('3').toBe(format('N', timestamp));
            done();
        });
    });
});
