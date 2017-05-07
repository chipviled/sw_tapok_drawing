jQuery("documrnt").ready(function(){
    var thumb = 'thumb_';
    var upload = '/upload/';
    
    if (console.log === undefined || console.log === null) console.log = function(){};
    
    if (/\/picture$/.test(document.location.pathname)) {
        var table = jQuery('table.table');
        var pictureNameEl, picturePathEl, pictureTd, tr;
        var pictureName = '', picturePath = ''
            
        table.find('tr').each(function() {
            tr = jQuery(this);
            pictureNameEl = tr.find('td:nth-child(5)');
            pictureTd = tr.find('td:nth-child(6)');
            picturePathEl = tr.find('td:nth-child(4)');
            
            if (pictureNameEl.length > 0) {
                pictureName = pictureNameEl.text().trim();
            }
            if (picturePathEl.length > 0) {
                picturePath = picturePathEl.text().trim();
            }
            
            pictureTd.html(
                '<img src="' + upload + picturePath + '/' 
                + thumb + pictureName + '" title="">'
            );
            
            
        });
    }
    
    if (/\/picture\/.*$/.test(document.location.pathname)) {
        var table = jQuery('table.table');
        var pictureNameEl, picturePathEl, pictureTd, tr;
        var pictureName = '', picturePath = ''
        
        pictureNameEl = table.find('tr:nth-child(6) input');
        picturePathEl = table.find('tr:nth-child(5) input');
        picture = table.find('tr:nth-child(4) img');
        
        pictureNameEl.attr('disabled', 'disabled');
        picturePathEl.attr('disabled', 'disabled');
        
        if (pictureNameEl.length > 0) {
            pictureName = pictureNameEl.val().trim();
        }
        if (picturePathEl.length > 0) {
            picturePath = picturePathEl.val().trim();
        }
        
        picture.attr('src',
                upload + picturePath + '/' 
                + thumb + pictureName
        );
        
        //console.log('>>>', picturePath, '|', pictureName);
    }
});
