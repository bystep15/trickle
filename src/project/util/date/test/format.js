describe('Util date format module test suite', function () {
    it('should return ture', function (done) {
        seajs.use('/project/util/date/js/format', function (format) {
            expect(true).toBeTruthy();
            done();
        });
    });
});
