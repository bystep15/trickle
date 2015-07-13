define(function (require) {
    var strength = require('../js/strength'),
        $ = require('jquery');

    new strength('#pwdPassword', {
        username: 'testasdf',
        oldPassword: 'oldPasswor$',
        callback: function (result) {
            $('#result').text(JSON.stringify(result));
        }
    });
});
