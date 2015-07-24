describe('Lazyload Test Suite', function () {
    describe('HashMap Test Suite', function () {
        'use strict';
 
        function inject(callback) {
            return function (done) {
                seajs.use('/project/lazyload/js/hashmap', function (HashMap) {
                    callback(new HashMap());
                    done();
                });
            };
        }
 
        it('将初始化一个空hashmap', inject(function (hashmap) {
            expect(hashmap.size()).toBe(0);
            expect(hashmap.values()).toEqual([]);
        }));
 
        it('将设置一个元素', inject(function (hashmap) {
            var element = document.createElement('div');
            hashmap.put(element, {value: 1});
            expect(hashmap.get(element)).toEqual({value: 1});
        }));
 
        it('重复设置将覆盖设置的第一个元素', inject(function (hashmap) {
            var element = document.createElement('div');
            hashmap.put(element, {value: 1});
            hashmap.put(element, {value: 2});
            expect(hashmap.get(element)).toEqual({value: 2});
            expect(hashmap.size()).toBe(1);
        }));
 
        it('获取不存在的元素，将返回undefined', inject(function (hashmap) {
            var element = document.createElement('div');
            expect(hashmap.get(element)).toBeUndefined();
        }));

        it('返回hashmap的长度', inject(function (hashmap) {
            hashmap.put(1, {value: 1});
            hashmap.put(1, {value: 2});
            hashmap.put(3, {value: 3});
            expect(hashmap.size()).toBe(2);
        }));

        it('返回hashmap的值数组', inject(function (hashmap) {
            hashmap.put(1, {value: 1});
            hashmap.put(1, {value: 2});
            hashmap.put(3, {value: 3});
            expect(hashmap.values()).toEqual([{value: 2}, {value: 3}]);
        }));

        it('删除指定key的元素', inject(function (hashmap) {
            hashmap.put(1, {value: 1});
            hashmap.put(1, {value: 2});
            hashmap.put(3, {value: 3});
            hashmap.remove(3);
            expect(hashmap.values()).toEqual([{value: 2}]);
        }));

        it('同一个值将返回相同的hashcode', inject(function (hashmap) {
            var foo = {},
                bar = {},
                baz = document.createElement('div');

            expect(hashmap.hashCode(1)).toBe(hashmap.hashCode(1));
            expect(hashmap.hashCode(2)).toBe(hashmap.hashCode(2));
            expect(hashmap.hashCode(1)).not.toBe(hashmap.hashCode(2));

            expect(hashmap.hashCode(foo)).toBe(hashmap.hashCode(foo));
            expect(hashmap.hashCode(foo)).not.toBe(hashmap.hashCode(bar));

            expect(hashmap.hashCode(baz)).toBe(hashmap.hashCode(baz));
        }));
    });
});
