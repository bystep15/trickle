define(function (require, exports, module) {
    var $ = require('jquery'),
        Stack = require('./stack'),
        HashMap = require('./hashmap'),
        Loader = require('./loader'),
        global = window,
        instance;

    function Lazyload() {
        var load = $.proxy(this.load, this);

        this.$global = $(window);

        this.hashmap = new HashMap();
        this.stack = new Stack();
        this.loader = new Loader({
            success: load,
            fail: load
        });

        this.listen();
    }

    Lazyload.prototype = {
        constructor: Lazyload,

        listen: function () {
            var update = $.proxy(this.update, this);
            this.$global.on('resize', update);
            this.$global.on('scroll', update);
        },

        load: function () {
            if (this.loader.isLoading || this.stack.isEmpty()) {
                return;
            }
            this.loader.load(this.stack.pop());
        },

        init: function (element) {
            var that = this,
                $images = $(element).find('img[data-lazyload-original]');

            $images.each(function () {
                if (that.hashmap.containsKey(this)) {
                    return;
                }
                if (this.getAttribute('data-lazyload-state')) {
                    return;
                }

                var $this = $(this);
                if (that.isVisible($this)) {
                    that.interact(this);
                    that.hashmap.put(this, {
                        element: this,
                        top: $this.offset().top,
                        height: $this.innerHeight()
                    });
                }
            });

            this.update();
        },

        interact: function (element) {
            element.setAttribute('data-lazyload-state', 'interactive');
        },

        update: function () {
            var that = this,
                images = this.hashmap.values();

            if (images.length === 0) {
                return;
            }

            $.each(images, function () {
                if (that.inViewport(this.top, this.height)) {
                    that.hashmap.remove(this.element);
                    that.stack.push(this.element);
                    that.load();
                }
            });
        },

        isVisible: function ($elem) {
            return !!($elem.width() || $elem.height()) &&
                $elem.css('display') !== 'none';
        },

        belowTheFold: function (top, height) {
            var bottom = top + height + 200,
                scrollY = global.scrollY || global.pageYOffset || global.document.documentElement.scrollTop,
                fold;

            fold = scrollY;

            return fold <= bottom;
        },

        aboveTheFold: function (top, height) {
            var fold,
                scrollY = global.scrollY || global.pageYOffset || global.document.documentElement.scrollTop;

            top -= 200;
            fold = this.$global.height() + scrollY;

            return fold >= top;
        },

        inViewport: function (top, height) {
            return this.belowTheFold(top, height) &&
                this.aboveTheFold(top, height);
        }
    };

    module.exports = function (element) {
        element = element || window;

        if (!instance) {
            instance = new Lazyload();
        }

        instance.init(element);

        return instance;
    };
});
