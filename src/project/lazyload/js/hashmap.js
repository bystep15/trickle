define(function (require, exports, module) {
    'use strict';

    function HashMap() {
        this.index = 0;
        this.container = [];
        this.map = {};
    }

    HashMap.prototype = {
        constructor: HashMap,

        hashCode: function (key) {
            var type = typeof key;

            if (type === 'object' && key.getAttribute) {
                if (key.getAttribute('data-lazyload-hashcode')) {
                    return key.getAttribute('data-lazyload-hashcode');
                }

                this.index += 1;
                key.setAttribute('data-lazyload-hashcode', type + this.index);
                return type + this.index;
            }

            this.index += 1;
            return type + this.index;
        },

        size: function () {
            return this.container.length;
        },

        values: function () {
            var values = [],
                i;

            for (i = this.container.length - 1; i >= 0; i -= 1) {
                values[i] = this.container[i];
            }

            return values;
        },

        containsKey: function (key) {
            var hashCode = this.hashCode(key);
            return this.map.hasOwnProperty(hashCode);
        },

        get: function (key) {
            var hashCode = this.hashCode(key);
            return this.map[hashCode];
        },

        put: function (key, value) {
            var hashCode = this.hashCode(key);

            this.map[hashCode] = value;
            this.container.push(value);
        },

        remove: function (key) {
            var hashCode = this.hashCode(key),
                index = this.container.indexOf(this.map[hashCode]);

            this.container.splice(index, 1);

            delete this.map[hashCode];
        }
    };

    module.exports = HashMap;
});