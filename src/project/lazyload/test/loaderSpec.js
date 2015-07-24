describe('Lazyload Test Suite', function () {
    describe('Loader Test Suite', function () {
        'use strict';

        var element;

        beforeEach(function () {
            element = {
                setAttribute: function () {},
                getAttribute: function () {
                    return 'interactive';
                }
            };
        });
 
        function inject(callback) {
            return function (done) {
                seajs.use(['/project/lazyload/js/loader', 'jquery'], function (Loader, $) {
                    callback(Loader, $, done);
                });
            };
        }
 
        it('图片加载成功将调用success回调', inject(function (Loader, $, done) {
            var loader;

            loader = new Loader({
                success: function () {
                    done();
                },
                fail: function () {}
            });

            loader.load(element);
            $(element).trigger('load');
        }));

        it('图片加载失败将调用fail回调', inject(function (Loader, $, done) {
            var loader;

            loader = new Loader({
                success: function () {
                },
                fail: function () {
                    done();
                }
            });

            loader.load(element);
            $(element).trigger('error');
        }));
    });
});
