describe('Perf Asset Test Suite', function () {
    'use strict';

    function init(Asset, url, key) {
        url = url || 'http://log.bystep.com';
        key = key || 'entry';
            
        return new Asset(url, key);
    }

    describe('Constructor Function', function () {
        it('should return 一个包含log方法的实例', function (done) {
            seajs.use('/project/pref/js/asset', function (Asset) {
                var asset = init(Asset);

                expect(asset.log).toEqual(jasmine.any(Function));
                done();
            });
        });

        it('should 抛出错误，当传入的参数不完整的时候', function (done) {
            seajs.use('/project/pref/js/asset', function (Asset) {
                function test() {
                    return new Asset();
                }
                expect(test).toThrow();
                done();
            });
        });
    });

    describe('getEntries', function () {
        it('should 返回一个当前网页中资源列表的数组', function (done) {
            seajs.use('/project/pref/js/asset', function (Asset) {
                var asset = init(Asset),
                    performance = jasmine.createSpyObj('performance',
                        ['getEntriesByType']);

                asset.getEntries(performance);

                expect(performance.getEntriesByType).toHaveBeenCalled();

                done();
            });
        });
    });

    describe('getSampling', function () {
        it('should 返回资源列表中加载时间最长的一个资源', function (done) {
            seajs.use('/project/pref/js/asset', function (Asset) {
                var asset = init(Asset),
                    entries = [
                        {duration: 300},
                        {duration: 200},
                        {duration: 100},
                        {duration: 500}
                    ];

                expect(asset.getSampling(entries)).toEqual({duration: 500});

                done();
            });
        });
    });

    describe('param', function () {
        it('should 将key和value序列化到search参数中', function (done) {
            seajs.use('/project/pref/js/asset', function (Asset) {
                var asset = init(Asset);

                expect(asset.param('http://a.com', 'key', 'value')).toBe('http://a.com?key=value');
                expect(asset.param('http://a.com/?b=c', 'key', 'value')).toBe('http://a.com/?b=c&key=value');

                done();
            });
        });
    });

    describe('isLucky', function () {
        it('should 返回true或false，标识是否可发送log', function (done) {
            seajs.use('/project/pref/js/asset', function (Asset) {
                var asset = init(Asset);

                expect(asset.isLucky()).toEqual(jasmine.any(Boolean));

                done();
            });
        });
    });
});
