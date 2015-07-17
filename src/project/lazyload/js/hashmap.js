define(function (require, exports, module) {
    'use strict';

    function HashMap() {
        this.index = 0;
        this.values = [];
        this.map = {};
    }

    HashMap.prototype = {
        constructor: HashMap,

        hashCode: function (key) {
            var type = typeof key;

            this.index += 1;

            return type + this.index;
        },

        size: function () {
            return this.values.length;
        },

        values: function () {
            var values = [],
                i;

            for (i = this.values.length - 1; i >= 0; i -= 1) {
                values[i] = this.values[i];
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
            this.values.push(values);
        },

        remove: function (key) {
            var hashCode = this.hashCode(key),
                index = this.values.indexOf(this.map[hashCode]);

            this.values.splite(index, 1);

            delete this.map[hashCode];
        }
    };

    module.exports = HashMap;
});
