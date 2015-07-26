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

    function getThumbnail(dataView) {

        // Little-Endian就是低位字节排放在内存的低地址端，高位字节排放在内存的高地址端。
        var isLittleEndian = dataView.getUint16(TIFF_OFFSET) == II;

        var Ifd1Offset = dataView.getUint32(IFD_OFFSET, isLittleEndian) + TIFF_OFFSET;

        Ifd1Offset += dataView.getUint16(Ifd1Offset, isLittleEndian) * 12 + 2;
        Ifd1Offset = dataView.getUint32(Ifd1Offset, isLittleEndian) + TIFF_OFFSET;

        var count = dataView.getUint16(Ifd1Offset, isLittleEndian),
            offset = Ifd1Offset + 2,
            tag,
            value,
            thumbnail = {
                //offset: undefined,
                //length: undefined
            };


        for (var i = 0; i < count; i += 1, offset += 12) {
            tag = dataView.getUint16(offset, isLittleEndian);
            value = dataView.getUint32(offset + 8, isLittleEndian);
            if (tag === 0x0201) {
                thumbnail.offset = value + TIFF_OFFSET;
            }
            if (tag === 0x0202) {
                thumbnail.length = value + TIFF_OFFSET;
            }
        }

        var blob = new Blob([dataView.buffer.slice(thumbnail.offset, thumbnail.offset + thumbnail.length)]);
        return blob;
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
        getThumbnail: wrap(getThumbnail)
    };
});
