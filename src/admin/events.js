const moment = require('moment');
const fs = require('fs');
const sharp = require('sharp');

const picFormat = {
        // 'JPG': '.jpg',
        // 'JPEG':'.jpg',
        // 'PNG': '.png',
        // 'GIF': '.gif',
        'jpg': '.jpg',
        'jpeg':'.jpg',
        'png': '.png',
        'gif': '.png'
};
const thumb = 'thumb_';
const maxSize = 1600;
const thumbSize = 160;



exports.preSave = async function (req, res, args, next) {
    //console.log(args, '---------');
    let result = null;
    if (args.name == 'picture') {
        console.log('picture');

        if (args.action == 'insert') {
            console.log('insert');
            result = await savePicture(req, res, args, next);
        } else if (args.action == 'update') {
            console.log('update');
            result = await savePicture(req, res, args, next);
        } else if (args.action == 'remove') {
            console.log('remove');
        }

        var now = moment(new Date()).format('YYYY-MM-DD hh:mm:ss');
        var record = args.data.view.picture.records[0].columns;
        if (args.action == 'insert') {
            record.created_at = now;
            record.updated_at = now;
        } else if (args.action == 'update') {
            record.updated_at = now;
        }
        record.file = null;
    }
    return await next(result);
}

savePicture = async function(req, res, args, next) {
    var record = args.data.view.picture.records[0].columns;
    var file = record.file;

    if (file !== null && file !== undefined && file !== '') {

        var fileBuffer = new Buffer(file, 'hex');
        var path = moment(new Date()).format('YYYY-MM');
        var name = moment(new Date()) + '_' + record.user_id;

        try {
            var image = sharp(fileBuffer);
            var metadata = await image.metadata();
            console.log('metadata', metadata);

            if (!(metadata.format in picFormat))
                return {'message': 'Unsupported format: ' + metadata.format};

            if (metadata.format === 'jpg') metadata.format = 'jpeg';

            record.file_path = path;
            record.file_name = name + picFormat[metadata.format];

            var w = metadata.width;
            var h = metadata.height;
            if (w > maxSize || h > maxSize){
                if (w > h) {
                    h = Math.round((maxSize/w) * h);
                    w = maxSize;
                } else {
                    w = Math.round((maxSize/h) * w);
                    h = maxSize;
                }
            }

            record.pict_width = w;
            record.pict_height = h;
        } catch(e) {
            return {message: 'Incorrect image file. ' + e.message};
        }

        try {
            var thumb_fileBuffer = null;
            var fileBuffer = null;

            if (metadata.format === 'jpeg') {
                thumb_fileBuffer = await image.resize(thumbSize, thumbSize, {
                    withoutEnlargement: true,
                    canvas: 'min',
                    crop: sharp.strategy.entropy
                }).jpeg({quality: 93}).toBuffer();

                fileBuffer = await image.resize(record.pict_width, null, {
                    withoutEnlargement: true,
                    canvas: 'min',
                }).jpeg({quality: 90}).toBuffer();
            } else {
                thumb_fileBuffer = await image.resize(thumbSize, thumbSize, {
                    withoutEnlargement: true,
                    canvas: 'min',
                    crop: sharp.strategy.entropy
                }).png({progressive: true}).toBuffer();

                fileBuffer = await image.resize(record.pict_width, null, {
                    withoutEnlargement: true,
                    canvas: 'min',
                }).png().toBuffer();
            }

        } catch(e) {
            return {'message': 'Can not create thumb or resize image. ' + e.message};
        }

        try {
            if (!fs.existsSync(args.upath + path)) {
                fs.mkdirSync(args.upath + path);
            }
            fs.writeFileSync(
                    args.upath + record.file_path + '/' + record.file_name,
                    fileBuffer,
                    'binary'
                );
            fs.writeFileSync(
                    args.upath + record.file_path + '/' + thumb + record.file_name,
                    thumb_fileBuffer,
                    'binary'
                );
            console.log('File saved.')
        } catch(e) {
            return {'message': e.message};
        }
    }
    return null;
}
