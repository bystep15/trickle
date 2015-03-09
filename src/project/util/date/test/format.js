describe('Util date format module test suite', function () {

    // Wed May 09 2018 22:28:22 GMT+0800 (CST)
    var timestamp = 1525876102869;

    it('pass `d` should return 月份中的第几天，有前导零的 2 位数字', function (done) {
        seajs.use('/project/util/date/js/format', function (format) {
            expect('09').toBe(format('d', timestamp));
            done();
        });
    });
});
