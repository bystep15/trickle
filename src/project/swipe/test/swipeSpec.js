describe('Swipe Test Suite', function () {
    'use strict';

    var swipe;

    function inject(callback) {
        return function (done) {
            seajs.use(['/project/swipe/js/swipe'], function (Swipe) {
                var container = document.createElement('div');
                container.innerHTML = '<div class="swipe-wrap">' +
                        '<div></div>' +
                        '<div></div>' +
                        '<div></div>' +
                    '</div>';
                swipe = new Swipe(container);
                callback(Swipe);
                done();
            });
        };
    }

    describe('Constructor', function () {
        it('当container根元素为空时，应该抛出错误', inject(function (Swipe) {
            var factory = function () {
                return new Swipe(null);
            };

            expect(factory).toThrowError('根元素必须存在!');
        }));
    });

    describe('Swipe.prototype.circle', function () {
        // 由于目前Swipe返回对象，故无法用上述的swipe对象
        // 这段测试，最后需要重构删除
        var swipe;
        beforeEach(function () {
            swipe = {
                slides: [0, 1, 2]
            };
        });
        it('计算swipe中page正确的索引值', inject(function (Swipe) {
            expect(Swipe.prototype.circle.call(swipe, -6)).toBe(0);
            expect(Swipe.prototype.circle.call(swipe, -5)).toBe(1);
            expect(Swipe.prototype.circle.call(swipe, -4)).toBe(2);
            expect(Swipe.prototype.circle.call(swipe, -3)).toBe(0);
            expect(Swipe.prototype.circle.call(swipe, -2)).toBe(1);
            expect(Swipe.prototype.circle.call(swipe, -1)).toBe(2);
            expect(Swipe.prototype.circle.call(swipe, 0)).toBe(0);
            expect(Swipe.prototype.circle.call(swipe, 1)).toBe(1);
            expect(Swipe.prototype.circle.call(swipe, 2)).toBe(2);
            expect(Swipe.prototype.circle.call(swipe, 3)).toBe(0);
            expect(Swipe.prototype.circle.call(swipe, 4)).toBe(1);
            expect(Swipe.prototype.circle.call(swipe, 5)).toBe(2);
        }));
    });

});
