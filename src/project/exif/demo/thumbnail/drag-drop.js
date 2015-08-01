define(function (require) {
    var EXIF = require('../../js/exif'),
        URL = window.URL || window.webkitURL,
        area = document.querySelector('.drop-area'),
        container = document.querySelector('.thumbnail-container');

    function load(blob) {
        var li = document.createElement('li'),
            img = document.createElement('img'),
            span = document.createElement('span'),
            url = URL.createObjectURL(blob);

        img.src = url;
        img.onload = function () {
            img.onload = null;
            URL.revokeObjectURL(url);
        };

        li.appendChild(img);
        li.appendChild(span);
        container.appendChild(li);
    }

    area.addEventListener('dragenter', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });

    area.addEventListener('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });

    area.addEventListener('drop', function (e) {
        var files = e.dataTransfer.files;

        e.stopPropagation();
        e.preventDefault();

        for (var i = 0, len = files.length; i < len; i += 1) {
            EXIF.getAllTags(files[i], function (value) {
                console.log(value);
                load(value.thumbnail);
            });
        }
    });
});
