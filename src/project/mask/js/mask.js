/**
 * 参考[Lottery](https://github.com/artwl/Lottery)实现
 * 只需要实现一个遮罩层就行了，奖品的内容用HTML即可
 */

define(function (require, exports, module) {
    'use strict';

    /**
     * @param 要遮罩元素的父元素
     * @param options {object} 
     * {
     *     color: '#FFFF00',
     *     url: '图片地址',
     * }
     */
    function Mask(container, options) {
        this.container = container;
        this.options = this.getOptions(options);
        this.init();
        this.bindEvent();
    }

    Mask.prototype = {
        constructor: Mask,

        getOptions: function (options) {
            options = options || {};
            return {
                color: options.color || '#cccccc',
                url: options.url
            };
        },

        setAttributes: function () {
            var attributes = {
                    style: 'position: absolute; left: 0; top: 0; width: 100%; height: 100%;',
                    width: this.width,
                    height: this.height
                },
                i;

            for (i in attributes) {
                if (attributes.hasOwnProperty(i)) {
                    this.canvas.setAttribute(i, attributes[i]);
                }
            }
        },

        getTransparentPercent: function () {
            var imageData = this.context.getImageData(0, 0, this.width, this.height),
                pixles = imageData.data,
                transparentPixlesCount = 0,
                i,
                len;

            for (i = 0, len = pixles.length; i < len; i += 4) {
                if (pixles[i + 3] < 128) {
                    transparentPixlesCount += 1;
                }
            }

            return transparentPixlesCount / len;
        },

        init: function () {
            var clientRect = this.container.getBoundingClientRect();

            this.width = clientRect.width;
            this.height = clientRect.height;
            this.top = clientRect.top;
            this.left = clientRect.left;

            if (!this.canvas) {
                this.canvas = document.createElement('canvas');
                this.container.appendChild(this.canvas);
                this.context = this.canvas.getContext('2d');
            }

            this.setAttributes();
            this.draw();
        },

        clear: function () {
            this.context.clearRect(0, 0, this.width, this.height);
        },

        draw: function () {
            var that,
                image;

            this.clear();

            this.context.fillStyle = this.options.color;
            this.context.fillRect(0, 0, this.width, this.height);

            if (this.options.url) {
                that = this;
                image = new Image();
                image.onload = function () {
                    that.context.drawImage(this, 0, 0);
                };
                image.src = this.options.url;
            }
        },

        point: function (x, y) {
            this.context.globalCompositeOperation = 'destination-out';

            var radialGradient = this.context.createRadialGradient(x, y, 0, x, y, 30);
            radialGradient.addColorStop(0, 'rgba(0,0,0,0.6)');
            radialGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            this.context.fillStyle = radialGradient;

            this.context.beginPath();
            this.context.arc(x, y, 30, 0, Math.PI * 2, true);
            this.context.fill();
            this.context.closePath();

            this.context.globalCompositeOperation = 'source-over';
        },

        handleEvent: function (event) {
            switch (event.type) {
            case 'touchstart':
                this.touchstart(event);
                break;
            case 'touchmove':
                this.touchmove(event);
                break;
            case 'touchend':
                this.touchend(event);
                break;
            default:
                break;
            }
        },

        bindEvent: function () {
            this.isActive = false;
            this.canvas.addEventListener('touchstart', this, false);
            this.canvas.addEventListener('touchmove', this, false);
            document.addEventListener('touchend', this, false);
        },

        touchstart: function (event) {
            this.isActive = true;

            var x = event.touches[0].clientX - this.left,
                y = event.touches[0].clientY - this.top;

            this.point(x, y);
        },

        touchmove: function (event) {
            if (!this.isActive) {
                return;
            }

            event.preventDefault();

            var x = event.touches[0].clientX - this.left,
                y = event.touches[0].clientY - this.top;

            this.point(x, y);
        },

        touchend: function () {
            this.isActive = false;
        },

        unbindEvent: function () {
            this.canvas.removeEventListener('touchstart', this, false);
            this.canvas.removeEventListener('touchmove', this, false);
            document.removeEventListener('touchend', this, false);
        },

        destroy: function () {
            this.unbindEvent();
            this.canvas.parentNode.remove(this.canvas);
        }
    };

    module.exports = Mask;
});
