// IE 9+ (bind 方法)
(function (global, base) {
    'use strict';

    function detect(prefix) {
        if (prefix) {
            return global.requestAnimationFrame &&
                (global.cancelAnimationFrame || global.cancelRequestAnimationFrame);
        }

        return global[prefix + 'RequestAnimationFrame'] &&
            (global[prefix + 'CancelAnimationFrame'] || global[prefix + 'CancelRequestAnimationFrame']);
    }

    function requestAnimationFrame() {
        if (detect()) {
            return global.requestAnimationFrame;
        }

        if (detect('webkit')) {
            return global.webkitRequestAnimationFrame;
        }

        if (detect('moz')) {
            return global.mozRequestAnimationFrame;
        }

        if (detect('ms')) {
            return global.msRequestAnimationFrame;
        }

        return function (callback) {
            return setTimeout(callback, 25);
        };
    }

    function cancelAnimationFrame() {
        if (detect()) {
            return global.cancelAnimationFrame || global.cancelRequestAnimationFrame;
        }

        if (detect('webkit')) {
            return global.webkitCancelAnimationFrame || global.webkitCancelRequestAnimationFrame;
        }

        if (detect('moz')) {
            return global.mozCancelAnimationFrame || global.mozCancelRequestAnimationFrame;
        }

        if (detect('ms')) {
            return global.msCancelAnimationFrame || global.msCancelRequestAnimationFrame;
        }

        return function (id) {
            return clearTimeout(id);
        };
    }

    base.namespace('util').animationFrame = {
        request: requestAnimationFrame().bind(global),
        cancel: cancelAnimationFrame().bind(global)
    };

}(this, this.base));
