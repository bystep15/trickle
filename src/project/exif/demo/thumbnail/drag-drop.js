define(function (require) {
    var EXIF = require('../../js/exif'),
        URL = window.URL || window.webkitURL,
        area = document.querySelector('.drop-area'),
        container = document.querySelector('.thumbnail-container');

    function load(file) {
        var reader = new FileReader();
        reader.onload = function () {
            var li = document.createElement('li'),
                img = document.createElement('img'),
                span = document.createElement('span'),
                blob,
                url;

            try {
                blob = EXIF.getThumbnail(reader.result);
            } catch (ex) {
                return;
            }
            url = URL.createObjectURL(blob);

            img.src = url;
            img.onload = function () {
                img.onload = null;
                URL.revokeObjectURL(url);
            };


            li.appendChild(img);
            li.appendChild(span);
            container.appendChild(li);
        };
        reader.readAsArrayBuffer(file.slice(0, Math.pow(2, 16)));
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

        for (i = 0, len = files.length; i < len; i += 1) {
            load(files[i]);
        }
    });
});
