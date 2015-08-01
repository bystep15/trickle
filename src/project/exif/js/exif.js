/**
 * EXIF
 */
define(function (require, exports, module) {
    'use strict';

    if (!ArrayBuffer.prototype.slice) {
        // http://stackoverflow.com/questions/21440050/arraybuffer-prototype-slice-shim-for-ie
        // https://connect.microsoft.com/IE/feedback/details/781472/arraybuffer-prototype-slice-is-not-implemented
        // slice is not implemented on IE. Implementing our own version if it is not supported.
        ArrayBuffer.prototype.slice = function (start, end) {
            var that = new Uint8Array(this);
            if (end == undefined) end = that.length;
            var result = new ArrayBuffer(end - start);
            var resultArray = new Uint8Array(result);
            for (var i = 0; i < resultArray.length; i++)
                resultArray[i] = that[i + start];
            return result;
        }
    }

    var II = 0x4949;
    var MM = 0x4d4d;
    var MARKER_EXIF = 0xffe1;
    var MARKER_EXIF_OFFSET = 2;
    var TIFF_POSITION = 12;
    var IFD0_POSITION = 16;

    var TAGS = {
        JpegIFOffset: 0x0201,
        JpegIFByteCount: 0x0202,
        ExifOffset: 0x8769,
        GPSInfo: 0x8825
    };

    // http://baike.baidu.com/view/22006.htm
    // http://blog.csdn.net/lsiyun/article/details/5346754
    var NAMES = {
        0x010E: 'ImageDescription',
        0x013B: 'Artist',
        0x010F: 'Make',
        0x0110: 'Model',
        /*
         Value	0th Row	0th Column
         1	top	left side
         2	top	right side
         3	bottom	right side
         4	bottom	left side
         5	left side	top
         6	right side	top
         7	right side	bottom
         8	left side	bottom
         */
        0x0112: 'Orientation',
        0x011A: 'XResolution',
        0x011B: 'YResolution',
        0x0128: 'ResolutionUnit',
        0x0131: 'Software',
        0x0132: 'DateTime',
        0x0213: 'YCbCrPositioning',
        0x8769: 'ExifOffset',
        0x829A: 'ExposureTime',
        0x829D: 'FNumber',
        0x8822: 'ExposureProgram',
        0x8827: 'ISOSpeedRatings',
        0x9000: 'ExifVersion',
        0x9003: 'DateTimeOriginal',
        0x9004: 'DateTimeDigitized',
        0x9204: 'ExposureBiasValue',
        0x9205: 'MaxApertureValue',
        0x9207: 'MeteringMode',
        0x9208: 'Lightsource',
        0x9209: 'Flash',
        0x920A: 'FocalLength',
        0x927C: 'MakerNote',
        0x9286: 'UserComment',
        0xA000: 'FlashPixVersion',
        0xA001: 'ColorSpace',
        0xA002: 'ExifImageWidth',
        0xA003: 'ExifImageLength',
        0xA433: 'LensMake',
        0xA434: 'LensModel'
    };

    function isExif(dataView) {
        if (dataView.getUint16(MARKER_EXIF_OFFSET) === MARKER_EXIF) {
            return true;
        }
        return false;
    }

    function isLittleEndian(value) {
        // Little-Endian就是低位字节排放在内存的低地址端，高位字节排放在内存的高地址端。
        if (value === II) {
            return true;
        }

        if (value === MM) {
            return false;
        }

        throw new Error('传入的TIFF Byte Order值错误！');
    }

    function getAscii(dataView, start, count) {
        var chars = [];
        for (var i = 0; i < count; i += 1) {
            chars.push(String.fromCharCode(dataView.getUint8(start + i)));
        }
        return chars.join('');
    }

    function getRational(dataView, start) {
        var numerator = dataView.getUint32(start);
        var denominator = dataView.getUint32(start + 4);
        return numerator / denominator;
    }

    function getSRational(dataView, start) {
        var numerator = dataView.getInt32(start);
        var denominator = dataView.getInt32(start + 4);
        return numerator / denominator;
    }

    function readEntry(dataView, start, littleEndian) {
        var tag = dataView.getUint16(start, littleEndian);
        var type = dataView.getUint16(start + 2, littleEndian);
        var size = dataView.getUint32(start + 4, littleEndian);
        var value,
            position;
        //value = dataView.getUint32(start + 8, littleEndian);

        switch (type) {
            case 1:
                // 忽略size>1
                value = dataView.getUint8(start + 8);
                break;
            case 2:
            case 7:
                if (size > 4) {
                    position = dataView.getUint32(start + 8, littleEndian) + TIFF_POSITION;
                } else {
                    position = start + 8;
                }
                value = getAscii(dataView, position, size);
                break;
            case 3:
                // 忽略size>1
                value = dataView.getUint16(start + 8, littleEndian);
                break;
            case 4:
                // 忽略size>1
                value = dataView.getUint32(start + 8, littleEndian);
                break;
            case 5:
                position = dataView.getUint32(start + 8, littleEndian) + TIFF_POSITION;
                value = getRational(dataView, position);
                break;
            case 9:
                // 忽略size>1
                value = dataView.getInt32(start + 8, littleEndian);
                break;
            case 10:
                position = dataView.getUint32(start + 8, littleEndian) + TIFF_POSITION;
                value = getSRational(dataView, position);
                break;
        }

        return {
            tag: tag,
            value: value
        };
    }

    function readIFD(dataView, position, littleEndian, tags) {
        var count = dataView.getUint16(position, littleEndian);
        var start = position + 2;
        var entry;

        for (var i = 0; i < count; i += 1, start += 12) {
            entry = readEntry(dataView, start, littleEndian);
            tags[entry.tag] = entry.value;
        }

        var offset = position + count * 12 + 2;
        position = dataView.getUint32(offset, littleEndian) + TIFF_POSITION;
        return position;
    }

    function getAllTags(dataView) {
        if (!isExif(dataView)) {
            return;
        }
        var tags = {};
        var result = {};
        var littleEndian = isLittleEndian(dataView.getUint16(TIFF_POSITION));
        var position = dataView.getUint32(IFD0_POSITION, littleEndian) + TIFF_POSITION;
        position = readIFD(dataView, position, littleEndian, tags);
        if (position) {
            readIFD(dataView, position, littleEndian, tags);
        }
        if (tags[TAGS.ExifOffset]) {
            readIFD(dataView, tags[TAGS.ExifOffset] + TIFF_POSITION, littleEndian, tags);
        }
        if (tags[TAGS.GPSInfo]) {
            readIFD(dataView, tags[TAGS.GPSInfo] + TIFF_POSITION, littleEndian, tags);
        }

        if (tags[TAGS.JpegIFOffset] && tags[TAGS.JpegIFByteCount]) {
            var begin = tags[TAGS.JpegIFOffset] + TIFF_POSITION;
            var end = begin + tags[TAGS.JpegIFByteCount] + TIFF_POSITION;

            result.thumbnail = new Blob([dataView.buffer.slice(begin, end)]);
        }
        var name;
        for (var i in tags) {
            name = NAMES[i];
            if (name) {
                result[name] = tags[i];
            }
        }
        return result;
    }

    function wrap(action) {
        return function (file, callback) {
            var reader = new FileReader();

            reader.onload = function () {
                callback(action(new DataView(reader.result)));
            };
            reader.readAsArrayBuffer(file.slice(0, Math.pow(2, 16)));
        };
    }

    module.exports = {
        getAllTags: wrap(getAllTags)
    };
});
