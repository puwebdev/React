var fs = require("fs");
var imagePath = "./public/system/images/screenshots/";
var slug = require("slug");

exports.saveScreenshot = function (viewId, img) {

    if (img.indexOf("data:image") !== 0) { return ""; }
    
    var data = img.split(",")[1];

    //Create a name
    var title = slug(viewId + "-" + (new Date().toISOString().replace(/T/, "-").replace(/:/, "-").replace(/\..+/, ""))) + ".png";

    //Save the image to disk
    fs.writeFile(imagePath + title, data, 'base64');

    console.log("Saved", title);
    return title;

}

exports.deleteScreenshotFile = function (imgPath) {
    if (!imgPath) { return; }
     fs.unlink(imagePath + imgPath, function(err) {
         if(err) { console.log(err); }
     });
}