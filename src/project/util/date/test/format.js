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
});
