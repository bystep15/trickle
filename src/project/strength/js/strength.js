define(function (require, exports, module) {
    'use strict';

    var MIN_LENGTH = 6,
        MAX_LENGTH = 30,
        RE_NUMBER = /^\d$/,
        RE_UPPERCASE = /^[A-Z]$/,
        RE_LOWERCASE = /^[a-z]$/,
        MESSAGES = [
            '弱：为了您的帐号安全，密码和帐号不能一致',
            '弱：试试字母、数字、符号混搭',
            '中：试试字母、数字、符号混搭',
            '强：请牢记您的密码'
        ],
        $ = require('jquery');

    /**
     * options: {
     *     oldPassword: [String],
     *     $oldPassword: [Element],
     *     username: [String],
     *     $username: [Element]
     * }
     */
    function Strength(element, options) {
        options = $.extend({
            callback: $.noop
        }, options);

        this.$element = $(element);
        this.options = options;

        this.value = '';

        this.init();
        this.listen();
    }

    Strength.prototype = {
        constructor: Strength,

        init: function () {
            var $indicator = $('<style>' +
                '.strength-indicator { display: block; width: 50px; height: 8px; border-radius: 2px; background-color: #e1e8ed; }' +
                '.strength-indicator-fill { display: block; width: 0; height: 100%; background-color: #6ec02a; -webkit-transition: width .5s; -moz-transition: width .5s; -ms-transition: width .5s; transition: width .5s;}' +
            '</style>' +
            '<div class="strength-indicator">' +
                '<b class="strength-indicator-fill"></b>' +
            '</div>');

            this.$element.parent().append($indicator);

            this.$indicator = $indicator.find('b');
        },

        indicate: function (factor) {
            factor = Math.max(factor, 0); // 旧版本的jQuery对待负值，不会处理成0
            this.$indicator.width(factor * 33 + '%');
        },

        check: function (text) {
            var ch,
                i,
                len = text.length,
                result = {
                    number: 0,
                    uppercase: 0,
                    lowercase: 0,
                    other: 0
                },
                factor = 0;

            if (len < MIN_LENGTH || len > MAX_LENGTH) {
                return {
                    factor: -1,
                    message: '请输入6-30个字符的密码'
                };
            }

            if (text === this.options.oldPassword) {
                return {
                    factor: -1,
                    message: '新旧密码不能一致'
                };
            }

            if (text !== this.options.username) {
                for (i = 0, len = text.length; i < len; i += 1) {
                    ch = text[i];
                    if (RE_NUMBER.test(ch)) {
                        result.number = 1;
                    } else if (RE_UPPERCASE.test(ch)) {
                        result.uppercase = 1;
                    } else if (RE_LOWERCASE.test(ch)) {
                        result.lowercase = 1;
                    } else {
                        result.other = 10;
                    }
                }

                factor = result.number + result.uppercase + result.lowercase + result.other;
            }

            factor = Math.min(factor, 3);

            return {
                factor: factor,
                message: MESSAGES[factor]
            };
        },

        listen: function () {
            var that = this,
                // 更新数字
                // IE6~8绑定propertychange
                // IE9绑定和 非IE绑定input
                // 监控文本
                // opera绑定input
                // 其他绑定keyup
                type = this.$element[0].oninput === null ? 'input' : 'propertychange';

            function listener(context) {
                var result = that.check(that.value);
                that.options.callback.call(context, result);
                that.indicate(result.factor);
            }

            this.$element.bind(type, function () {
                that.value = this.value;
                listener(this);
            });

            if (this.options.$username) {
                $(this.options.$username).bind(type, function () {
                    that.options.username = this.value;
                    listener(this);
                });
            }

            if (this.options.$oldPassword) {
                $(this.options.$oldPassword).bind(type, function () {
                    that.options.oldPassword = this.value;
                    listener(this);
                });
            }
        }
    };

    module.exports = Strength;
});
