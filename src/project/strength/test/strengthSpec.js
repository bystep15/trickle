describe('Perf Asset Test Suite', function () {
    'use strict';

    it('', function (done) {
        seajs.use('/project/strength/js/strength', function (Strength) {
            var strength = new Strength({}, {
                username: 'testabc'
            });

            expect(strength.check('asdf')).toEqual(jasmine.any(Object));
            expect(strength.check('asdf').factor).toEqual(jasmine.any(Number));
            expect(strength.check('asdf').message).toEqual(jasmine.any(String));
            done();
        });
    });
});
