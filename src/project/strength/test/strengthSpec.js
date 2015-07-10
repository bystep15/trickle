describe('Strength Test Suite', function () {
    'use strict';

    var input;

    function inject(callback) {
        return function (done) {
            seajs.use('/project/strength/js/strength', function (Strength) {

                callback(Strength);

                done();
            });
        };
    }

    beforeEach(function () {
        var container = $('<div><input type="password" /></div>');
        input = container.find('input')[0];
    });

    describe('check', function () {
        it('check方法应该返回一个包含factor属性和message属性的object', inject(function (Strength) {
            var strength = new Strength(input, {
                    username: 'testabc'
                }),
                result;

            result = strength.check('');

            expect(result).toEqual(jasmine.any(Object));
            expect(result.factor).toEqual(jasmine.any(Number));
            expect(result.message).toEqual(jasmine.any(String));

        }));

        it('当传入空字符串的时候check方法应该返回factor -1', inject(function (Strength) {
            var strength = new Strength(input, {
                    username: 'testabc'
                }),
                result;

            result = strength.check('');

            expect(result).toEqual({
                factor: -1,
                message: '请输入6-30个字符的密码'
            });
        }));

        it('当传入的字符串长度小于6或大约30的时候check方法应该返回factor -1', inject(function (Strength) {
            var strength = new Strength(input, {
                    username: 'testabc'
                }),
                result;

            result = strength.check('1a#F');

            expect(result).toEqual({
                factor: -1,
                message: '请输入6-30个字符的密码'
            });

            result = strength.check('abcdefghijklmnopqrstuvwxyz1234567890');

            expect(result).toEqual({
                factor: -1,
                message: '请输入6-30个字符的密码'
            });
        }));

        it('当传入的字符串和username的时候check方法应该返回factor 0', inject(function (Strength) {
            var strength = new Strength(input, {
                    username: 'testabc'
                }),
                result;

            result = strength.check('testabc');

            expect(result).toEqual({
                factor: 0,
                message: '弱：为了您的帐号安全，密码和帐号不能一致'
            });
        }));

        it('当传入的字符串为纯数字、纯小写字母或纯大写字母的时候check方法应该返回factor 1', inject(function (Strength) {
            var strength = new Strength(input, {
                    username: 'testabc'
                }),
                result;

            result = strength.check('1234567');

            expect(result).toEqual({
                factor: 1,
                message: '弱：试试字母、数字、符号混搭'
            });

            result = strength.check('abcdefg');

            expect(result).toEqual({
                factor: 1,
                message: '弱：试试字母、数字、符号混搭'
            });

            result = strength.check('ABCDEFG');

            expect(result).toEqual({
                factor: 1,
                message: '弱：试试字母、数字、符号混搭'
            });
        }));

        it('当传入的字符串为纯数字、纯小写字母或纯大写字母两种情况混搭的时候check方法应该返回factor 2', inject(function (Strength) {
            var strength = new Strength(input, {
                    username: 'testabc'
                }),
                result;

            result = strength.check('1234abc');

            expect(result).toEqual({
                factor: 2,
                message: '中：试试字母、数字、符号混搭'
            });

            result = strength.check('abcdEFG');
            expect(result).toEqual({
                factor: 2,
                message: '中：试试字母、数字、符号混搭'
            });

            result = strength.check('ABCD123');

            expect(result).toEqual({
                factor: 2,
                message: '中：试试字母、数字、符号混搭'
            });
        }));

        it('当传入的字符串为纯数字、纯小写字母或纯大写字母三种情况混搭的时候check方法应该返回factor 3', inject(function (Strength) {
            var strength = new Strength(input, {
                    username: 'testabc'
                }),
                result;

            result = strength.check('123abcD');

            expect(result).toEqual({
                factor: 3,
                message: '强：请牢记您的密码'
            });

            result = strength.check('abc4EFG');
            expect(result).toEqual({
                factor: 3,
                message: '强：请牢记您的密码'
            });

            result = strength.check('ABCd123');

            expect(result).toEqual({
                factor: 3,
                message: '强：请牢记您的密码'
            });
        }));

        it('当传入的字符串为包含特殊字符的时候check方法应该返回factor 3', inject(function (Strength) {
            var strength = new Strength(input, {
                    username: 'testabc'
                }),
                result;

            result = strength.check('!@#$%^');

            expect(result).toEqual({
                factor: 3,
                message: '强：请牢记您的密码'
            });

            result = strength.check('12345^');

            expect(result).toEqual({
                factor: 3,
                message: '强：请牢记您的密码'
            });

            result = strength.check('abcde)');

            expect(result).toEqual({
                factor: 3,
                message: '强：请牢记您的密码'
            });

            result = strength.check('UIPOU(');

            expect(result).toEqual({
                factor: 3,
                message: '强：请牢记您的密码'
            });

        }));
    });

    describe('indicate', function () {
        it('应该根据factor参数的值，发生变化', inject(function (Strength) {
            var strength = new Strength(input, {
                username: 'testabc'
            });

            strength.indicate(0);
            expect(strength.$indicator.width()).toBe(0);

            strength.indicate(1);
            expect(strength.$indicator.width()).toBe(33);

            strength.indicate(2);
            expect(strength.$indicator.width()).toBe(66);

            strength.indicate(3);
            expect(strength.$indicator.width()).toBe(99);

            strength.indicate(-1);
            expect(strength.$indicator.width()).toBe(0);
        }));
    });
});
