define(function (require) {
    'use strict';

    var Alphabet = require('./alphabet'),
        Spinning = require('./spinning');

    require('../css/hello.css');

    new Alphabet('#container').render();
    new Spinning('#container').render();
});
