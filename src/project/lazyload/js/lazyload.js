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
            this.$global.bind('resize', $.proxy(this.update, this));
            this.$global.bind('scroll', $.proxy(this.update, this));
        },

        load: function () {
            if (this.loader.isLoading || this.stack.isEmpty()) {
                return;
            }
            this.loader.load(this.stack.pop());
        },

        init: function (element) {
            var that = this,
                $images = $(element).find('[data-lazyload-original]');

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

            this.$global.trigger('scroll');
        },

        interact: function (element) {
            element.setAttribute('data-lazyload-state', 'interactive');
        },

        update: function () {
            var that = this,
                images = this.hashmap.values();

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

        aboveTheFold: function (top, height) {
            var bottom = top + height,
                fold;

            fold = global.scrollY;

            return fold >= bottom;
        },

        belowTheFold: function (top, height) {
            var fold;

            fold = this.$global.height() + global.scrollY;

            return fold <= top;
        },

        inViewport: function (top, height) {
            return !this.belowTheFold(top, height) &&
                !this.aboveTheFold(top, height);
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
