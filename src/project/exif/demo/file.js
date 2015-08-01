define(function () {
    var URL = window.URL || window.webkitURL,
        area = document.querySelector('.drop-area'),
        container = document.querySelector('.thumbnail-container');

    function load(file) {
        var li = document.createElement('li'),
            img = document.createElement('img'),
            span = document.createElement('span'),
            url = URL.createObjectURL(file);

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
            load(files[i]);
        }
    });
});
