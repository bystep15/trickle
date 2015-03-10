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

    it('should return 每月天数后面的英文后缀2 个字符(st，nd，rd 或者 th) when pass `S`', function (done) {
        seajs.use('/project/util/date/js/format', function (format) {
            expect('th').toBe(format('S', timestamp));
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

    it('should return 星期中的第几天,0(星期天)到6(星期六) when pass `w`', function (done) {
        seajs.use('/project/util/date/js/format', function (format) {
            expect('3').toBe(format('w', timestamp));
            done();
        });
    });

    it('should return 年中的第几天,(0到365) when pass `z`', function (done) {
        seajs.use('/project/util/date/js/format', function (format) {
            // Thu Jan 01 2015 00:00:00 GMT+0800 (CST)
            expect('0').toBe(format('z', 1420041600000));
            // Sun Jan 04 2015 00:00:00 GMT+0800 (CST)
            expect('3').toBe(format('z', 1420300800000));
            // Mon Jan 05 2015 00:00:00 GMT+0800 (CST)
            expect('4').toBe(format('z', 1420387200000));
            expect('128').toBe(format('z', timestamp));
            done();
        });
    });

    it('should return ISO-8601 格式年份中的第几周，每周从星期一开始 when pass `W`', function (done) {
        seajs.use('/project/util/date/js/format', function (format) {
            // Thu Jan 01 2015 00:00:00 GMT+0800 (CST)
            expect('01').toBe(format('W', 1420041600000));
            // Sun Jan 04 2015 00:00:00 GMT+0800 (CST)
            expect('01').toBe(format('W', 1420300800000));
            expect('01').toBe(format('W', 1420300800001));
            // Mon Jan 05 2015 00:00:00 GMT+0800 (CST)
            expect('02').toBe(format('W', 1420387200000));
            expect('19').toBe(format('W', timestamp));
            done();
        });
    });

    it('should return 月份完整文本格式(例如January) when pass `F`', function (done) {
        seajs.use('/project/util/date/js/format', function (format) {
            expect('May').toBe(format('F', timestamp));
            done();
        });
    });

    it('should return 三个字母缩写表示的月份 when pass `M`', function (done) {
        seajs.use('/project/util/date/js/format', function (format) {
            // Thu Jan 01 2015 00:00:00 GMT+0800 (CST)
            expect('Jan').toBe(format('M', 1420041600000));
            expect('May').toBe(format('M', timestamp));
            done();
        });
    });

    it('should return 数字表示的月份(有前导零,01到12) when pass `m`', function (done) {
        seajs.use('/project/util/date/js/format', function (format) {
            expect('05').toBe(format('m', timestamp));
            done();
        });
    });

    it('should return 数字表示的月份(没有前导零,1到12) when pass `n`', function (done) {
        seajs.use('/project/util/date/js/format', function (format) {
            expect('5').toBe(format('n', timestamp));
            done();
        });
    });

    it('should return 给定月份所应有的天数(28到31) when pass `t`', function (done) {
        seajs.use('/project/util/date/js/format', function (format) {
            expect('31').toBe(format('t', timestamp));
            done();
        });
    });

    it('should return 是否为闰年(闰年为1，否则为0) when pass `L`', function (done) {
        seajs.use('/project/util/date/js/format', function (format) {
            expect('0').toBe(format('L', timestamp));
            done();
        });
    });
});
