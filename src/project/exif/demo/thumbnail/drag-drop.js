define(function (require) {
    var EXIF = require('../../js/exif');
    var global = window;
    var container = document.querySelector('.drop-area'),
        fileList = document.querySelector('.thumbnail-container');

    container.addEventListener('dragenter', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });

    container.addEventListener('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });

    container.addEventListener('drop', function (e) {
        var files = e.dataTransfer.files,
        //file = files[0].slice(0, Math.pow(2, 16)),
        //file = files[0],
            time = Date.now();

        e.stopPropagation();
        e.preventDefault();

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
                url = global.URL.createObjectURL(blob);

                img.src = url;
                global.URL.revokeObjectURL(url);

                li.appendChild(img);
                li.appendChild(span);
                fileList.appendChild(li);
            };
            reader.readAsArrayBuffer(file);
        }

        for (i = 0, len = files.length; i < len; i += 1) {
            load(files[i].slice(0, Math.pow(2, 16)));
        }
    });
});
