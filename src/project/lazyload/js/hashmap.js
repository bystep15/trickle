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

            if (type === 'object') {
                if (key.getAttribute) {
                    if (key.getAttribute('data-lazyload-hashcode')) {
                        return key.getAttribute('data-lazyload-hashcode');
                    }
             
                    this.index += 1;
                    key.setAttribute('data-lazyload-hashcode', type + this.index);
                    return type + this.index;
                }


                if (!key.__hashcode__) {
                    this.index += 1;
                    key.__hashcode__ = type + this.index;
                }
                return key.__hashcode__;
            }

            return type + key;
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

            if (this.containsKey(key)) {
                this.remove(key);
            }

            this.map[hashCode] = value;
            this.container.push(value);
        },

        remove: function (key) {
            var hashCode = this.hashCode(key),
                index,
                len;

            // index = this.container.indexOf(this.map[hashCode]);
            for (index = 0, len = this.container.length; index < len; index += 1) {
                if (this.map[hashCode] === this.container[index]) {
                    break;
                }
            }

            this.container.splice(index, 1);

            delete this.map[hashCode];
        }
    };

    module.exports = HashMap;
});
