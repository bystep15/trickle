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

        console.log(tag.toString(16), type, size, value);
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

    function getTag(dataView, tag) {
        if (!isExif(dataView)) {
            return;
        }
        var tags = {};
        var littleEndian = isLittleEndian(dataView.getUint16(TIFF_POSITION));
        var position = dataView.getUint32(IFD0_POSITION, littleEndian) + TIFF_POSITION;
        position = readIFD(dataView, position, littleEndian, tags);
        readIFD(dataView, position, littleEndian, tags);
        readIFD(dataView, tags[TAGS.ExifOffset] + TIFF_POSITION, littleEndian, tags);
        readIFD(dataView, tags[TAGS.GPSInfo] + TIFF_POSITION, littleEndian, tags);
        console.log(tags);
        return tags[tag];
    }

    function getThumbnail(dataView) {
        if (!isExif(dataView)) {
            return;
        }
        var littleEndian = isLittleEndian(dataView.getUint16(TIFF_POSITION));
        var position = dataView.getUint32(IFD0_POSITION, littleEndian) + TIFF_POSITION;
        var count = dataView.getUint16(position, littleEndian);
        var offset = position + count * 12 + 2;
        position = dataView.getUint32(offset, littleEndian) + TIFF_POSITION;

        count = dataView.getUint16(position, littleEndian);
        var start = position + 2;
        var tag;
        var type;
        var size;
        var value;
        var begin;
        var end;


        for (var i = 0; i < count; i += 1, start += 12) {
            tag = dataView.getUint16(start, littleEndian);
            type = dataView.getUint16(start + 2, littleEndian);
            size = dataView.getUint32(start + 4, littleEndian);
            value = dataView.getUint32(start + 8, littleEndian);
            if (tag === TAGS.JpegIFOffset) {
                begin = value + TIFF_POSITION;
            }
            if (tag === TAGS.JpegIFByteCount) {
                end = begin + TIFF_POSITION + value;
            }
        }

        return new Blob([dataView.buffer.slice(begin, end)]);
    }

    function wrap(action) {
        return function (file, tag, callback) {
            var reader = new FileReader();

            if (callback === undefined && typeof tag === 'function') {
                callback = tag;
                tag = undefined;
            }

            reader.onload = function () {
                callback(action(new DataView(reader.result), tag));
            };
            reader.readAsArrayBuffer(file.slice(0, Math.pow(2, 16)));
        };
    }

    module.exports = {
        getThumbnail: wrap(getThumbnail),
        getTag: wrap(getTag)
    };
});
