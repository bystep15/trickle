define(function (require, exports, module) {
    var $ = require('jquery'),
        Stack = require('./stack'),
        HashMap = require('./hashmap'),
        Loader = require('./loader'),
        global = window,
        instance;

    $.fn.lazyload.defaults = {
        threshold: 0,
        loadallAfterOnload: false
    };

    function Lazyload() {
        this.stack = new Stack();
        this.hashmap = new HashMap();
        this.loader = new Loader();
        this.$global = $(window);
        this.$images = $();
        this.images = [];
        this.listen();
    }

    Lazyload.prototype = {
        constructor: Lazyload,

        init: function () {
        },

        load: function () {
        },

        listen: function () {
            this.$global.bind('resize', update);
            this.$global.bind('scroll', update);
        },

        load: function () {
        },

        next: function () {
        },

        add: function () {
        },

        init: function (element) {
            var that = this,
                $images = $(element).find('[data-lazyload-original]');

            $images.each(function () {
                if (that.hashmap.containsKey(this) {
                    return;
                }
                if (!this.getAttribute('data-lazyload-state')) {
                    return;
                }

                var $this = $(this);
                if (that.isVisible($this)) {
                    that.hashmap.put(this, {
                        element: this,
                        top: $this.offset().top,
                        height: $this.height()
                    });
                }
            });
        },

        interact: function (element) {
            element.setAttribute('data-lazyload-state', 'interactive');
            that.stack.push(this.getAttribute('data-lazyload-original'));
        },

        update: function () {
            var that = this,
                images = this.hashmap.values();

            $.each(images, function () {
                if (that.inViewport(this.top, this.height)) {
                    that.interact(this.element);
                    that.hashmap.remove(this.element);
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
            var $global = $(global),
                fold;

            fold = $global.height() + global.scrollY;

            return fold <= top;
        },

        inViewport: function (top, height) {
            return this.belowTheFold(top, height) ||
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
