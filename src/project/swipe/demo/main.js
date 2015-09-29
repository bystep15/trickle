define(function (require) {
    'use strict';

    var Swipe = require('../js/swipe'),
        $ = require('jquery'),
        btnPrev = document.getElementById('btn-prev'),
        btnNext = document.getElementById('btn-next'),
        swipe;

    swipe = new Swipe(document.getElementById('mySwipe'), {
        startSlide: 4,
        auto: 3000
        // continuous: true,
        // disableScroll: true,
        // stopPropagation: true,
        // callback: function(index, element) {},
        // transitionEnd: function(index, element) {}
    });

    $(btnPrev).bind('click', function (e) {
        swipe.prev();
    }, false);

    $(btnNext).bind('click', function (e) {
        swipe.next();
    }, false);

    window.swipe = swipe;
});
