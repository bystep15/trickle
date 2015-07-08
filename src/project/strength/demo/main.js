define(function (require) {
    var strength = require('../js/strength'),
        $ = require('jquery');

    new strength('#pwdPassword', {
        username: 'testasdf',
        callback: function (result) {
            $('#result').text(JSON.stringify(result));
        }
    });
});
