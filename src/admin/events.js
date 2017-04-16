const fileUpload = require('express-fileupload');
const moment = require('moment');
const fs = require('fs');

exports.preSave = function (req, res, args, next) {
    console.log(args, '---------');
    if (args.name == 'picture') {
        console.log('picture');
        
        if (args.action == 'insert') {
            console.log('insert');
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

savePicture = function (req, res, args, next) {
    var record = args.data.view.picture.records[0].columns;
    var file = record.file;
    
    if (file !== null && file !== undefined && file !== '') {
        var path = moment(new Date()).format('YYYYMMDD');
        var name = moment(new Date()) + '_' + record.user_id;
        record.file_path = path;
        record.file_name = name;
        
        try {
            if (!fs.existsSync(args.upath + path)) {
                fs.mkdirSync(args.upath + path);
            }
            fs.writeFileSync(args.upath + path + '/' + name, new Buffer(file, 'hex'), 'binary');
            
            
            console.log('File saved.')
        } catch(e) {
            throw e;
        }
        
    }
    
    console.log('>>>', file);
    return null;
}



