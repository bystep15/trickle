define(function (require) {
    'use strict';

    var Mask = require('../js/mask'),
        mask;

    mask = new Mask(document.querySelector('#mask'));
    mask.init();
});
