/*
 * 在[Swipe](https://github.com/thebird/Swipe)基础上修改
 */
define(function (require, exports, module) {
    'use strict';

    // utilities
    // check browser capabilities
    var browser = {
        touch: ('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch),
        transitions: (function (temp) {
            var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'],
                i;
            for (i in props) {
                if (temp.style[props[i]] !== undefined) {
                    return true;
                }
            }
            return false;
        })(document.createElement('swipe'))
    };

    // simple no operation function
    function noop() {
    }

    // offload a functions execution
    function offloadFn(fn) {
        setTimeout(fn || noop, 0);
    }

    function proxy(fn, context) {
        if (fn.bind) {
            return fn.bind(context);
        }
        return function () {
            fn.apply(context, arguments);
        };
    }

    function Swipe(container, options) {
        if (!container) {
            // quit if no root element
            throw new Error('根元素必须存在!');
        }

        this.container = container;
        this.element = this.container.children[0];
        this.options = this.defaults(options);

        this.index = this.options.startSlide;
        this.delay = this.options.auto;     // setup auto slideshow
        this.interval = null;

        // setup initial vars
        this.start = {};
        this.delta = {};
        this.isScrolling = undefined;

        // trigger setup
        this.setup();

        // start auto slideshow if applicable
        if (this.delay) {
            this.begin();
        }

        // add event listeners
        if (this.element.addEventListener) {
            // set touchstart event on element
            if (browser.touch) {
                this.element.addEventListener('touchstart', this, false);
            }

            if (browser.transitions) {
                this.element.addEventListener('webkitTransitionEnd', this, false);
                this.element.addEventListener('msTransitionEnd', this, false);
                this.element.addEventListener('oTransitionEnd', this, false);
                this.element.addEventListener('otransitionend', this, false);
                this.element.addEventListener('transitionend', this, false);
            }
        }

        // set resize event on window
        if (window.addEventListener) {
            window.addEventListener('resize', this, false);
        } else if (window.attachEvent) {
            // to play nice with old IE
            this.onresize = proxy(this.setup, this);
            window.attachEvent('onresize', this.onresize);
        }
    }

    Swipe.prototype = {
        constructor: Swipe,

        defaults: function (options) {
            options = options || {};
            options.startSlide = parseInt(options.startSlide, 10) || 0;
            options.speed = options.speed || 300;
            options.continuous = options.continuous || true;
            options.auto = options.auto || 0;
            return options;
        },

        setup: function () {
            var that = this;

            // cache slides
            that.slides = that.element.children;
            that.length = that.slides.length;

            // set continuous to false if only one slide
            if (that.slides.length < 2) {
                that.options.continuous = false;
            }

            //special case if two slides
            if (browser.transitions && that.options.continuous && that.slides.length < 3) {
                that.element.appendChild(that.slides[0].cloneNode(true));
                that.element.appendChild(that.element.children[1].cloneNode(true));
                that.slides = that.element.children;
            }

            // create an array to store current positions of each slide
            that.slidePos = new Array(that.slides.length);

            // determine width of each slide
            that.width = that.container.getBoundingClientRect().width || that.container.offsetWidth;

            that.element.style.width = (that.slides.length * that.width) + 'px';

            // stack elements
            var pos = that.slides.length;
            while (pos--) {

                var slide = that.slides[pos];

                slide.style.width = that.width + 'px';
                slide.setAttribute('data-index', pos);

                if (browser.transitions) {
                    slide.style.left = (pos * -that.width) + 'px';
                    that.move(pos, that.index > pos ? -that.width : (that.index < pos ? that.width : 0), 0);
                }

            }

            // reposition elements before and after index
            if (that.options.continuous && browser.transitions) {
                that.move(that.circle(that.index - 1), -that.width, 0);
                that.move(that.circle(that.index + 1), that.width, 0);
            }

            if (!browser.transitions) that.element.style.left = (that.index * -that.width) + 'px';

            that.container.style.visibility = 'visible';

        },

        /**
         * a simple positive modulo using slides.length
         */
        circle: function (index) {
            var length = this.slides.length;
            return (length + (index % length)) % length;
        },

        /**
         * 用CSS 3中的Transform相关属性实现移动
         * @param index
         * @param dist
         * @param speed
         */
        translate: function (index, dist, speed) {

            var slide = this.slides[index];
            var style = slide && slide.style;

            if (!style) {
                return;
            }

            style.webkitTransitionDuration =
                style.MozTransitionDuration =
                    style.msTransitionDuration =
                        style.OTransitionDuration =
                            style.transitionDuration = speed + 'ms';

            style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
            style.msTransform =
                style.MozTransform =
                    style.OTransform = 'translateX(' + dist + 'px)';

        },

        animate: function (from, to, speed) {
            var that = this;

            // if not an animation, just reposition
            if (!speed) {

                that.element.style.left = to + 'px';
                return;

            }

            var start = +new Date;

            var timer = setInterval(function () {

                var timeElap = +new Date - start;

                if (timeElap > speed) {

                    that.element.style.left = to + 'px';

                    if (that.delay) that.begin();

                    that.options.transitionEnd && that.options.transitionEnd.call(event, that.index, that.slides[that.index]);

                    clearInterval(timer);
                    return;

                }

                that.element.style.left = (( (to - from) * (Math.floor((timeElap / speed) * 100) / 100) ) + from) + 'px';

            }, 4);

        },

        move: function (index, dist, speed) {

            this.translate(index, dist, speed);
            this.slidePos[index] = dist;

        },

        slide: function (to, slideSpeed) {
            // cancel slideshow
            this.stop();
            var that = this;
            // do nothing if already on requested slide
            var index = this.index;

            if (index == to) {
                return;
            }

            var width = this.width;

            var options = that.options;

            if (browser.transitions) {

                var direction = Math.abs(index - to) / (index - to); // 1: backward, -1: forward

                // get the actual position of the slide
                if (options.continuous) {
                    var natural_direction = direction;
                    direction = -that.slidePos[that.circle(to)] / width;

                    // if going forward but to < index, use to = slides.length + to
                    // if going backward but to > index, use to = -slides.length + to
                    if (direction !== natural_direction) {
                        to = -direction * that.slides.length + to;
                    }

                }

                var diff = Math.abs(index - to) - 1;

                // move all the slides between index and to in the right direction
                while (diff--) {
                    that.move(that.circle((to > index ? to : index) - diff - 1), width * direction, 0);
                }

                to = that.circle(to);

                that.move(index, width * direction, slideSpeed || options.speed);
                that.move(to, 0, slideSpeed || options.speed);

                if (options.continuous) {
                    // we need to get the next in place
                    that.move(that.circle(to - direction), -(width * direction), 0);
                }

            } else {

                to = that.circle(to);
                that.animate(index * -width, to * -width, slideSpeed || options.speed);
                //no fallback for a circular continuous if the browser does not accept transitions
            }

            that.index = to;
            if (options.callback) {
                offloadFn(options.callback(index, that.slides[index]));
            }
        },

        prev: function () {
            // cancel slideshow
            this.stop();
            if (this.options.continuous || this.index) {
                this.slide(this.index - 1);
            }

        },

        next: function () {
            // cancel slideshow
            this.stop();
            if (this.options.continuous || this.index < (this.slides.length - 1)) {
                this.slide(this.index + 1);
            }

        },

        begin: function () {

            this.interval = setTimeout(proxy(this.next, this), this.delay);

        },

        stop: function () {

            this.delay = 0;
            clearTimeout(this.interval);

        },

        getPos: function () {

            // return current index position
            return that.index;

        },
        getNumSlides: function () {

            // return total number of slides
            return that.length;
        },
        kill: function () {

            // cancel slideshow
            that.stop();

            // reset element
            that.element.style.width = '';
            that.element.style.left = '';

            // reset slides
            var pos = that.slides.length;
            while (pos--) {

                var slide = that.slides[pos];
                slide.style.width = '';
                slide.style.left = '';

                if (browser.transitions) that.translate(pos, 0, 0);

            }

            // removed event listeners
            if (that.element.removeEventListener) {

                // remove current event listeners
                that.element.removeEventListener('touchstart', that, false);
                that.element.removeEventListener('webkitTransitionEnd', that, false);
                that.element.removeEventListener('msTransitionEnd', that, false);
                that.element.removeEventListener('oTransitionEnd', that, false);
                that.element.removeEventListener('otransitionend', that, false);
                that.element.removeEventListener('transitionend', that, false);
                window.removeEventListener('resize', that, false);

            }
            else {

                window.detachEvent('onresize', this.onresize);

            }

        },

        handleEvent: function (event) {
            var that = this;
            switch (event.type) {
                case 'touchstart':
                    this.startHandler(event);
                    break;
                case 'touchmove':
                    this.moveHandler(event);
                    break;
                case 'touchend':
                    offloadFn(this.endHandler(event));
                    break;
                case 'webkitTransitionEnd':
                case 'msTransitionEnd':
                case 'oTransitionEnd':
                case 'otransitionend':
                case 'transitionend':
                    offloadFn(this.transitionEndHandler(event));
                    break;
                case 'resize':
                    offloadFn(proxy(this.setup, this));
                    break;
            }

            if (that.options.stopPropagation) event.stopPropagation();

        },
        startHandler: function (event) {
            var that = this;
            var touches = event.touches[0];

            // measure start values
            that.start = {

                // get initial touch coords
                x: touches.pageX,
                y: touches.pageY,

                // store time to determine touch duration
                time: +new Date

            };

            // used for testing first move event
            that.isScrolling = undefined;

            // reset delta and end measurements
            that.delta = {};

            // attach touchmove and touchend listeners
            that.element.addEventListener('touchmove', this, false);
            that.element.addEventListener('touchend', this, false);

        },
        moveHandler: function (event) {
            var that = this;
            // ensure swiping with one touch and not pinching
            if (event.touches.length > 1 || event.scale && event.scale !== 1) return

            if (that.options.disableScroll) event.preventDefault();

            var touches = event.touches[0];

            // measure change in x and y
            that.delta = {
                x: touches.pageX - that.start.x,
                y: touches.pageY - that.start.y
            }

            // determine if scrolling test has run - one time test
            if (typeof that.isScrolling == 'undefined') {
                that.isScrolling = !!( that.isScrolling || Math.abs(that.delta.x) < Math.abs(that.delta.y) );
            }

            // if user is not trying to scroll vertically
            if (!that.isScrolling) {

                // prevent native scrolling
                event.preventDefault();

                // stop slideshow
                that.stop();

                // increase resistance if first or last slide
                if (that.options.continuous) { // we don't add resistance at the end

                    that.translate(that.circle(that.index - 1), that.delta.x + that.slidePos[that.circle(that.index - 1)], 0);
                    that.translate(that.index, that.delta.x + that.slidePos[that.index], 0);
                    that.translate(that.circle(that.index + 1), that.delta.x + that.slidePos[that.circle(that.index + 1)], 0);

                } else {

                    that.delta.x =
                        that.delta.x /
                        ( (!that.index && that.delta.x > 0               // if first slide and sliding left
                            || that.index == that.slides.length - 1        // or if last slide and sliding right
                            && that.delta.x < 0                       // and if sliding at all
                        ) ?
                            ( Math.abs(that.delta.x) / that.width + 1 )      // determine resistance level
                            : 1 );                                 // no resistance if false

                    // translate 1:1
                    that.translate(that.index - 1, that.delta.x + that.slidePos[that.index - 1], 0);
                    that.translate(that.index, that.delta.x + that.slidePos[that.index], 0);
                    that.translate(that.index + 1, that.delta.x + that.slidePos[that.index + 1], 0);
                }

            }

        },
        endHandler: function (event) {
            var that = this;

            // measure duration
            var duration = +new Date - that.start.time;

            // determine if slide attempt triggers next/prev slide
            var isValidSlide =
                Number(duration) < 250               // if slide duration is less than 250ms
                && Math.abs(that.delta.x) > 20            // and if slide amt is greater than 20px
                || Math.abs(that.delta.x) > that.width / 2;      // or if slide amt is greater than half the width

            // determine if slide attempt is past start and end
            var isPastBounds =
                !that.index && that.delta.x > 0                            // if first slide and slide amt is greater than 0
                || that.index == that.slides.length - 1 && that.delta.x < 0;    // or if last slide and slide amt is less than 0

            if (that.options.continuous) isPastBounds = false;

            // determine direction of swipe (true:right, false:left)
            var direction = that.delta.x < 0;

            // if not scrolling vertically
            if (!that.isScrolling) {

                if (isValidSlide && !isPastBounds) {

                    if (direction) {

                        if (that.options.continuous) { // we need to get the next in this direction in place

                            that.move(that.circle(that.index - 1), -that.width, 0);
                            that.move(that.circle(that.index + 2), that.width, 0);

                        } else {
                            that.move(that.index - 1, -that.width, 0);
                        }

                        that.move(that.index, that.slidePos[that.index] - that.width, that.options.speed);
                        that.move(that.circle(that.index + 1), that.slidePos[that.circle(that.index + 1)] - that.width, that.options.speed);
                        that.index = that.circle(that.index + 1);

                    } else {
                        if (that.options.continuous) { // we need to get the next in this direction in place

                            that.move(that.circle(that.index + 1), that.width, 0);
                            that.move(that.circle(that.index - 2), -that.width, 0);

                        } else {
                            that.move(that.index + 1, that.width, 0);
                        }

                        that.move(that.index, that.slidePos[that.index] + that.width, that.options.speed);
                        that.move(that.circle(that.index - 1), that.slidePos[that.circle(that.index - 1)] + that.width, that.options.speed);
                        that.index = that.circle(that.index - 1);

                    }

                    that.options.callback && that.options.callback(that.index, that.slides[that.index]);

                } else {

                    if (that.options.continuous) {

                        that.move(that.circle(that.index - 1), -that.width, that.options.speed);
                        that.move(that.index, 0, that.options.speed);
                        that.move(that.circle(that.index + 1), that.width, that.options.speed);

                    } else {

                        that.move(that.index - 1, -that.width, that.options.speed);
                        that.move(that.index, 0, that.options.speed);
                        that.move(that.index + 1, that.width, that.options.speed);
                    }

                }

            }

            // kill touchmove and touchend event listeners until touchstart called again
            that.element.removeEventListener('touchmove', that, false);
            that.element.removeEventListener('touchend', that, false);

        },

        transitionEndHandler: function (event) {

            var index = this.index;

            if (parseInt(event.target.getAttribute('data-index'), 10) == index) {

                if (this.delay) {
                    this.begin();
                }

                if (this.options.transitionEnd) {
                    this.options.transitionEnd.call(event, index, event.target);
                }

            }

        }
    };

    module.exports = Swipe;
});
