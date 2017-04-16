const fileUpload = require('express-fileupload');

exports.preSave = function (req, res, args, next) {
    console.log(args, '---------');
    if (args.name == 'picture') {
        console.log('picture');
        if (args.action == 'insert') {
            console.log('insert');
        } else if (args.action == 'update') {
            console.log('update');
            savePicture(args);
        } else if (args.action == 'remove') {
            console.log('remove');
        }
    }
    next();
}

savePicture = function (args) {
    file = args.data.view.picture.records[0].columns.file_path;
    args.data.view.picture.records[0].columns.file_path = null;
    
    console.log('>>>', file);
    return null;
}
