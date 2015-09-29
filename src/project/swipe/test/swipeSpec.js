describe('Swipe Test Suite', function () {
    'use strict';

    var input;

    function inject(callback) {
        return function (done) {
            seajs.use(['/project/swipe/js/swipe'], function (Swipe) {
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

});
