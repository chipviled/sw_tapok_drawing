const fileUpload = require('express-fileupload');
const moment = require('moment');
const fs = require('fs');
const im = require('imagemagick-native');
const deasync = require('deasync');

const picFormat = {
        'JPG': '.jpg',
        'JPEG':'.jpg',
        'PNG': '.png',
        'GIF': '.gif'
};
const thumb = 'thumb_';
const maxSize = 1600;
const thumbSize = 160;



exports.preSave = function (req, res, args, next) {
    //console.log(args, '---------');
    if (args.name == 'picture') {
        console.log('picture');
        
        if (args.action == 'insert') {
            console.log('insert');
//            var file = args.data.view.picture.records[0].columns.file;
//            if (file === null || file === undefined || file === '') {
//                return next({'message': 'Need file not selected'});
//            }
            savePicture(req, res, args, next);
        } else if (args.action == 'update') {
            console.log('update');
            savePicture(req, res, args, next);
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
    next();
}

savePicture = function(req, res, args, next) {
    var record = args.data.view.picture.records[0].columns;
    var file = record.file;
    
    if (file !== null && file !== undefined && file !== '') {
        
        var fileBuffer = new Buffer(file, 'hex');
        var path = moment(new Date()).format('YYYYMMDD');
        var name = moment(new Date()) + '_' + record.user_id;
        
        try {
            var im_identify = deasync(im.identify);
            var identify = im_identify({
                srcData: fileBuffer
                });
            //console.log('identify', identify);

            if (!(identify.format in picFormat))
                return next({'message': 'Unsupported format: ' + identify.format});
            
            record.file_path = path;
            record.file_name = name + picFormat[identify.format];
            
            var w = identify.width;
            var h = identify.height;
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
            return next({'message': 'Incorrect image file'});
        }
        
        try {
            var im_convert = deasync(im.convert);
            var thumb_fileBuffer = im_convert({
                srcData: fileBuffer,
                width: thumbSize,
                height: thumbSize,
                quality: 93,
                resizeStyle: 'aspectfill',
                gravity: 'Center'
            });
            
            fileBuffer = im_convert({
                srcData: fileBuffer,
                width: record.pict_width,
                height: record.pict_height,
                quality: 90,
            });
        } catch(e) {
            return next({'message': 'Can not create thumb or resize image'});
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
            return next({'message': e});
        }
    }
    return null;
}





