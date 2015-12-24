define(function (require) {
    var $ = require('jquery'),
        validation = require('../js/validation');

    validation.validate($("#commentForm"));
});
