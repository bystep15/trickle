var fs = require('fs');

module.exports = {
    options: {
        // 映射CSS中背景路径，支持函数和数组，默认为 null
        imagepath_map: null,
        // 各图片间间距，如果设置为奇数，会强制+1以保证生成的2x图片为偶数宽高，默认 0
        padding: 2,
        // 是否使用 image-set 作为2x图片实现，默认不使用
        useimageset: false,
        // 是否以时间戳为文件名生成新的雪碧图文件，如果启用请注意清理之前生成的文件，默认不生成新文件
        newsprite: false,
        // 给雪碧图追加时间戳，默认不追加
        spritestamp: false,
        // 在CSS文件末尾追加时间戳，默认不追加
        cssstamp: false,
        // 默认使用二叉树最优排列算法
        algorithm: 'binary-tree',
        // 默认使用`pngsmith`图像处理引擎
        engine: 'pngsmith'
    }
};

// 根据目录结构生成project任务
(function () {
    var list = fs.readdirSync('src/project/');

    list.forEach(function (item) {
        if (item) {
            module.exports['project-' + item] = {
                options: {
                    imagepath: '.build/' + item + '/css/icon/',
                    spritedest: 'dist/' + item + '/css/icon/',
                    spritepath: './icon/'
                },
                files: [{
                    expand: true,
                    cwd: '.build/' + item + '/css/',
                    src: '*.css',
                    dest: '.build/' + item + '/css/'
                }]
            };
        }
    });
}());
