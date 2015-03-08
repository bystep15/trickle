define(function (require, exports, module) {
    'use strict';
    var $ = require('jquery');

    function random(x) {
        return Math.ceil(Math.random() * x);
    }

    function Spinning(container) {
        this.$container = $(container);
        this.$icons = this.$container.children();
        this.spinnings = [];
    }

    module.exports = Spinning;

    Spinning.prototype.render = function () {
        this._init();
        this.$container.css('background', 'none');
        this.$icons.show();
        this._spin();
    };

    Spinning.prototype._init = function () {
        var that = this;

        this.$icons.each(function (i, icon) {
            var $icon = $(icon),
                start = random(360),
                timer;

            function spin() {
                $icon.css('transform', 'rotate(' + start + 'deg)');
            }

            $icon.css({
                left: i * 50 + random(10),
                top: random(10),
                zIndex: 1000
            }).mouseenter(function () {
                $icon.fadeTo(250, 1).css({
                    zIndex: 1001,
                    transform: 'rotate(0deg)'
                });
            }).mouseleave(function () {
                $icon.fadeTo(250, 0.6).css({
                    zIndex: 1000
                });

                if (timer) {
                    clearTimeout(timer);
                }

                timer = setTimeout(spin, random(5000));
            });

            that.spinnings[i] = spin;
        });
    };

    Spinning.prototype._spin = function () {
        $(this.spinnings).each(function (i, fn) {
            setTimeout(fn, random(2000));
        });
    };
});
