/**
 * EXIF
 */
define(function (require, exports, module) {
    var II = 0x4949;
    var MM = 0x4d4d;
    var TIFF_OFFSET = 12;
    var IFD_OFFSET = 16;

    var ExifTags = {
        0xFFE1: 'JPEG Marker',
        0x0201: 'JPEGInterchangeFormat',
        0x0202: 'JPEGInterchangeFormatLength'
    };

    function getThumbnail(file) {
        var dataView = new DataView(file);

        // Little-Endian就是低位字节排放在内存的低地址端，高位字节排放在内存的高地址端。
        var isLittleEndian = dataView.getUint16(TIFF_OFFSET) == II;

        var Ifd1Offset = dataView.getUint32(IFD_OFFSET, isLittleEndian) + TIFF_OFFSET;

        Ifd1Offset += dataView.getUint16(Ifd1Offset, isLittleEndian) * 12 + 2;
        Ifd1Offset = dataView.getUint32(Ifd1Offset, isLittleEndian) + TIFF_OFFSET;

        var count = dataView.getUint16(Ifd1Offset, isLittleEndian),
            offset = Ifd1Offset + 2,
            tag,
            type,
            size,
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

        //dataView = new DataView(file, thumbnail.offset, thumbnail.length);
        //var blob = new Blob([dataView.buffer]);
        var blob = new Blob([file.slice(thumbnail.offset, thumbnail.offset + thumbnail.length)]);
        return blob;
    };

    module.exports = {
        getThumbnail: getThumbnail
    };
});
