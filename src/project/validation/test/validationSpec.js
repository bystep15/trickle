describe('Validation Test Suite', function () {
    'use strict';

    function inject(callback) {
        return function (done) {
            seajs.use(['/project/validation/js/validation'], function (Validation) {
                callback(Validation);

                done();
            });
        };
    }

    describe('Constructor', function () {

        it('当传入的form参数无效时，将抛出错误', inject(function (Validation) {

            expect(function () {
                new Validation();
            }).toThrowError();

            expect(function () {
                new Validation('invalid selector');
            }).toThrowError();

            expect(function () {
                new Validation(document.createElement('div'));
            }).toThrowError();

            expect(function () {
                new Validation([
                    document.createElement('form'),
                    document.createElement('form')
                ]);
            }).toThrowError();

        }));

        it('当传入一个已经实例化的form对象时，将返回上次实例化的对象', inject(function (Validation) {

            var form = document.createElement('form'),
                validation = new Validation(form);

            expect(new Validation(form)).toBe(validation);

        }));

    });

});
