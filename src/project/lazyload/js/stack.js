define(function (require, exports, module) {
    'use strict';

    /*
     * 栈
     */
    function Stack() {
        this.container = [];
    }

    Stack.prototype = {
        constructor: Stack,

        push: function (item) {
            return this.container.push(item);
        },

        /*
         * 删除容器中所有跟栈顶相同的元素
         */
        pop: function () {
            var item = this.container.pop(),
                i;

            for (i = this.container.length - 1; i >= 0; i -= 1) {
                if (item === this.container[i]) {
                    this.container.splice(i, 1);
                }
            }

            return item;
        },

        peek: function () {
            return this.container[this.container.length - 1];
        },

        isEmpty: function () {
            return this.container.length === 0;
        },

        isFull: function () {
            return false;
        },

        clear: function () {
            this.container.length = 0;
        }
    };

    module.exports = Stack;
});
