/*
 * 在[Swipe](https://github.com/thebird/Swipe)基础上修改
 */
define(function (require, exports, module) {
    'use strict';

    // utilities
    // simple no operation function
    var noop = function () {
    };
    // offload a functions execution
    var offloadFn = function (fn) {
        setTimeout(fn || noop, 0)
    };
    // check browser capabilities
    var browser = {
        addEventListener: !!window.addEventListener,
        touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
        transitions: (function (temp) {
            var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
            for (var i in props) if (temp.style[props[i]] !== undefined) return true;
            return false;
        })(document.createElement('swipe'))
    };

    function Swipe(container, options) {

        // quit if no root element
        if (!container) {
            throw new Error('根元素必须存在!');
        }


        var that = this;

        this.container = container;
        this.element = this.container.children[0];
        this.options = this.defaults(options);
        this.index = options.startSlide;

        var slides, slidePos, width, length;

        function setup() {

            // cache slides
            slides = that.element.children;
            length = slides.length;

            // set continuous to false if only one slide
            if (slides.length < 2) that.options.continuous = false;

            //special case if two slides
            if (browser.transitions && that.options.continuous && slides.length < 3) {
                that.element.appendChild(slides[0].cloneNode(true));
                that.element.appendChild(that.element.children[1].cloneNode(true));
                slides = that.element.children;
            }

            // create an array to store current positions of each slide
            slidePos = new Array(slides.length);

            // determine width of each slide
            width = that.container.getBoundingClientRect().width || that.container.offsetWidth;

            that.element.style.width = (slides.length * width) + 'px';

            // stack elements
            var pos = slides.length;
            while (pos--) {

                var slide = slides[pos];

                slide.style.width = width + 'px';
                slide.setAttribute('data-index', pos);

                if (browser.transitions) {
                    slide.style.left = (pos * -width) + 'px';
                    move(pos, that.index > pos ? -width : (that.index < pos ? width : 0), 0);
                }

            }

            // reposition elements before and after index
            if (that.options.continuous && browser.transitions) {
                move(circle(that.index - 1), -width, 0);
                move(circle(that.index + 1), width, 0);
            }

            if (!browser.transitions) that.element.style.left = (that.index * -width) + 'px';

            that.container.style.visibility = 'visible';

        }

        function prev() {

            if (that.options.continuous) slide(that.index - 1);
            else if (that.index) slide(that.index - 1);

        }

        function next() {

            if (that.options.continuous) slide(that.index + 1);
            else if (that.index < slides.length - 1) slide(that.index + 1);

        }

        function circle(index) {

            // a simple positive modulo using slides.length
            return (slides.length + (index % slides.length)) % slides.length;

        }

        function slide(to, slideSpeed) {

            // do nothing if already on requested slide
            if (that.index == to) return;

            if (browser.transitions) {

                var direction = Math.abs(that.index - to) / (that.index - to); // 1: backward, -1: forward

                // get the actual position of the slide
                if (that.options.continuous) {
                    var natural_direction = direction;
                    direction = -slidePos[circle(to)] / width;

                    // if going forward but to < index, use to = slides.length + to
                    // if going backward but to > index, use to = -slides.length + to
                    if (direction !== natural_direction) to = -direction * slides.length + to;

                }

                var diff = Math.abs(that.index - to) - 1;

                // move all the slides between index and to in the right direction
                while (diff--) move(circle((to > that.index ? to : that.index) - diff - 1), width * direction, 0);

                to = circle(to);

                move(that.index, width * direction, slideSpeed || that.options.speed);
                move(to, 0, slideSpeed || that.options.speed);

                if (that.options.continuous) move(circle(to - direction), -(width * direction), 0); // we need to get the next in place

            } else {

                to = circle(to);
                animate(that.index * -width, to * -width, slideSpeed || that.options.speed);
                //no fallback for a circular continuous if the browser does not accept transitions
            }

            that.index = to;
            offloadFn(that.options.callback && that.options.callback(that.index, slides[that.index]));
        }

        function move(index, dist, speed) {

            translate(index, dist, speed);
            slidePos[index] = dist;

        }

        function translate(index, dist, speed) {

            var slide = slides[index];
            var style = slide && slide.style;

            if (!style) return;

            style.webkitTransitionDuration =
                style.MozTransitionDuration =
                    style.msTransitionDuration =
                        style.OTransitionDuration =
                            style.transitionDuration = speed + 'ms';

            style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
            style.msTransform =
                style.MozTransform =
                    style.OTransform = 'translateX(' + dist + 'px)';

        }

        function animate(from, to, speed) {

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

                    if (delay) begin();

                    that.options.transitionEnd && that.options.transitionEnd.call(event, that.index, slides[that.index]);

                    clearInterval(timer);
                    return;

                }

                that.element.style.left = (( (to - from) * (Math.floor((timeElap / speed) * 100) / 100) ) + from) + 'px';

            }, 4);

        }

        // setup auto slideshow
        var delay = that.options.auto || 0;
        var interval;

        function begin() {

            interval = setTimeout(next, delay);

        }

        function stop() {

            delay = 0;
            clearTimeout(interval);

        }


        // setup initial vars
        var start = {};
        var delta = {};
        var isScrolling;

        // setup event capturing
        var events = {

            handleEvent: function (event) {

                switch (event.type) {
                    case 'touchstart':
                        this.start(event);
                        break;
                    case 'touchmove':
                        this.move(event);
                        break;
                    case 'touchend':
                        offloadFn(this.end(event));
                        break;
                    case 'webkitTransitionEnd':
                    case 'msTransitionEnd':
                    case 'oTransitionEnd':
                    case 'otransitionend':
                    case 'transitionend':
                        offloadFn(this.transitionEnd(event));
                        break;
                    case 'resize':
                        offloadFn(setup);
                        break;
                }

                if (that.options.stopPropagation) event.stopPropagation();

            },
            start: function (event) {

                var touches = event.touches[0];

                // measure start values
                start = {

                    // get initial touch coords
                    x: touches.pageX,
                    y: touches.pageY,

                    // store time to determine touch duration
                    time: +new Date

                };

                // used for testing first move event
                isScrolling = undefined;

                // reset delta and end measurements
                delta = {};

                // attach touchmove and touchend listeners
                that.element.addEventListener('touchmove', this, false);
                that.element.addEventListener('touchend', this, false);

            },
            move: function (event) {

                // ensure swiping with one touch and not pinching
                if (event.touches.length > 1 || event.scale && event.scale !== 1) return

                if (that.options.disableScroll) event.preventDefault();

                var touches = event.touches[0];

                // measure change in x and y
                delta = {
                    x: touches.pageX - start.x,
                    y: touches.pageY - start.y
                }

                // determine if scrolling test has run - one time test
                if (typeof isScrolling == 'undefined') {
                    isScrolling = !!( isScrolling || Math.abs(delta.x) < Math.abs(delta.y) );
                }

                // if user is not trying to scroll vertically
                if (!isScrolling) {

                    // prevent native scrolling
                    event.preventDefault();

                    // stop slideshow
                    stop();

                    // increase resistance if first or last slide
                    if (that.options.continuous) { // we don't add resistance at the end

                        translate(circle(that.index - 1), delta.x + slidePos[circle(that.index - 1)], 0);
                        translate(that.index, delta.x + slidePos[that.index], 0);
                        translate(circle(that.index + 1), delta.x + slidePos[circle(that.index + 1)], 0);

                    } else {

                        delta.x =
                            delta.x /
                            ( (!that.index && delta.x > 0               // if first slide and sliding left
                                || that.index == slides.length - 1        // or if last slide and sliding right
                                && delta.x < 0                       // and if sliding at all
                            ) ?
                                ( Math.abs(delta.x) / width + 1 )      // determine resistance level
                                : 1 );                                 // no resistance if false

                        // translate 1:1
                        translate(that.index - 1, delta.x + slidePos[that.index - 1], 0);
                        translate(that.index, delta.x + slidePos[that.index], 0);
                        translate(that.index + 1, delta.x + slidePos[that.index + 1], 0);
                    }

                }

            },
            end: function (event) {

                // measure duration
                var duration = +new Date - start.time;

                // determine if slide attempt triggers next/prev slide
                var isValidSlide =
                    Number(duration) < 250               // if slide duration is less than 250ms
                    && Math.abs(delta.x) > 20            // and if slide amt is greater than 20px
                    || Math.abs(delta.x) > width / 2;      // or if slide amt is greater than half the width

                // determine if slide attempt is past start and end
                var isPastBounds =
                    !that.index && delta.x > 0                            // if first slide and slide amt is greater than 0
                    || that.index == slides.length - 1 && delta.x < 0;    // or if last slide and slide amt is less than 0

                if (that.options.continuous) isPastBounds = false;

                // determine direction of swipe (true:right, false:left)
                var direction = delta.x < 0;

                // if not scrolling vertically
                if (!isScrolling) {

                    if (isValidSlide && !isPastBounds) {

                        if (direction) {

                            if (that.options.continuous) { // we need to get the next in this direction in place

                                move(circle(that.index - 1), -width, 0);
                                move(circle(that.index + 2), width, 0);

                            } else {
                                move(that.index - 1, -width, 0);
                            }

                            move(that.index, slidePos[that.index] - width, that.options.speed);
                            move(circle(that.index + 1), slidePos[circle(that.index + 1)] - width, that.options.speed);
                            that.index = circle(that.index + 1);

                        } else {
                            if (that.options.continuous) { // we need to get the next in this direction in place

                                move(circle(that.index + 1), width, 0);
                                move(circle(that.index - 2), -width, 0);

                            } else {
                                move(that.index + 1, width, 0);
                            }

                            move(that.index, slidePos[that.index] + width, that.options.speed);
                            move(circle(that.index - 1), slidePos[circle(that.index - 1)] + width, that.options.speed);
                            that.index = circle(that.index - 1);

                        }

                        that.options.callback && that.options.callback(that.index, slides[that.index]);

                    } else {

                        if (that.options.continuous) {

                            move(circle(that.index - 1), -width, that.options.speed);
                            move(that.index, 0, that.options.speed);
                            move(circle(that.index + 1), width, that.options.speed);

                        } else {

                            move(that.index - 1, -width, that.options.speed);
                            move(that.index, 0, that.options.speed);
                            move(that.index + 1, width, that.options.speed);
                        }

                    }

                }

                // kill touchmove and touchend event listeners until touchstart called again
                that.element.removeEventListener('touchmove', events, false)
                that.element.removeEventListener('touchend', events, false)

            },
            transitionEnd: function (event) {

                if (parseInt(event.target.getAttribute('data-index'), 10) == that.index) {

                    if (delay) begin();

                    that.options.transitionEnd && that.options.transitionEnd.call(event, that.index, slides[that.index]);

                }

            }

        }

        // trigger setup
        setup();

        // start auto slideshow if applicable
        if (delay) begin();


        // add event listeners
        if (browser.addEventListener) {

            // set touchstart event on element
            if (browser.touch) that.element.addEventListener('touchstart', events, false);

            if (browser.transitions) {
                that.element.addEventListener('webkitTransitionEnd', events, false);
                that.element.addEventListener('msTransitionEnd', events, false);
                that.element.addEventListener('oTransitionEnd', events, false);
                that.element.addEventListener('otransitionend', events, false);
                that.element.addEventListener('transitionend', events, false);
            }

            // set resize event on window
            window.addEventListener('resize', events, false);

        } else {

            window.onresize = function () {
                setup()
            }; // to play nice with old IE

        }

        // expose the Swipe API
        return {
            setup: setup,

            slide: function (to, speed) {

                // cancel slideshow
                stop();

                slide(to, speed);

            },
            prev: function () {

                // cancel slideshow
                stop();

                prev();

            },
            next: function () {

                // cancel slideshow
                stop();

                next();

            },
            stop: function () {

                // cancel slideshow
                stop();

            },
            getPos: function () {

                // return current index position
                return that.index;

            },
            getNumSlides: function () {

                // return total number of slides
                return length;
            },
            kill: function () {

                // cancel slideshow
                stop();

                // reset element
                that.element.style.width = '';
                that.element.style.left = '';

                // reset slides
                var pos = slides.length;
                while (pos--) {

                    var slide = slides[pos];
                    slide.style.width = '';
                    slide.style.left = '';

                    if (browser.transitions) translate(pos, 0, 0);

                }

                // removed event listeners
                if (browser.addEventListener) {

                    // remove current event listeners
                    that.element.removeEventListener('touchstart', events, false);
                    that.element.removeEventListener('webkitTransitionEnd', events, false);
                    that.element.removeEventListener('msTransitionEnd', events, false);
                    that.element.removeEventListener('oTransitionEnd', events, false);
                    that.element.removeEventListener('otransitionend', events, false);
                    that.element.removeEventListener('transitionend', events, false);
                    window.removeEventListener('resize', events, false);

                }
                else {

                    window.onresize = null;

                }

            }
        }

    }

    Swipe.prototype = {
        constructor: Swipe,

        defaults: function (options) {
            options = options || {};
            options.startSlide = parseInt(options.startSlide, 10) || 0;
            options.speed = options.speed || 300;
            options.continuous = options.continuous || true;
            return options;
        }
    };

    module.exports = Swipe;
});
