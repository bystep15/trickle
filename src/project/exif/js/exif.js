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
    var TIFF_OFFSET = 12;
    var IFD_OFFSET = 16;

    var ExifTags = {
        0xFFE1: 'JPEG Marker',
        0x0201: 'JPEGInterchangeFormat',
        0x0202: 'JPEGInterchangeFormatLength'
    };

    function getTag(dataView, tag) {
        // Little-Endian就是低位字节排放在内存的低地址端，高位字节排放在内存的高地址端。
        var isLittleEndian = dataView.getUint16(TIFF_OFFSET) == II;


    }

    function getThumbnail(dataView) {

        // Little-Endian就是低位字节排放在内存的低地址端，高位字节排放在内存的高地址端。
        var isLittleEndian = dataView.getUint16(TIFF_OFFSET) == II;

        var ifdOffset = dataView.getUint32(IFD_OFFSET, isLittleEndian) + TIFF_OFFSET;

        ifdOffset += dataView.getUint16(ifdOffset, isLittleEndian) * 12 + 2;
        ifdOffset = dataView.getUint32(ifdOffset, isLittleEndian) + TIFF_OFFSET;

        var count = dataView.getUint16(ifdOffset, isLittleEndian),
            start = ifdOffset + 2,
            tag,
            value,
            offset,
            length;


        for (var i = 0; i < count; i += 1, start += 12) {
            tag = dataView.getUint16(start, isLittleEndian);
            value = dataView.getUint32(start + 8, isLittleEndian);
            if (tag === 0x0201) {
                offset = value + TIFF_OFFSET;
            }
            if (tag === 0x0202) {
                length = value + TIFF_OFFSET;
            }
        }

        return new Blob([dataView.buffer.slice(offset, offset + length)]);
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
