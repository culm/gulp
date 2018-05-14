cordova.define("com.hejin.takephoto.takephoto", function(require, exports, module) {
var exec = require('cordova/exec');
               
exports.takeCamera = function(arg0, success, error) {
    exec(success, error, "takephoto", "takeCamera", [arg0]);
};
exports.getBase64 = function(arg0, success, error) {
    exec(success, error, "takephoto", "getBase64", [arg0]);
};
exports.getVersion = function(arg0, success, error) {
    exec(success, error, "takephoto", "getVersion", [arg0]);
};
exports.showPhotoPeview = function(arg0, success, error) {
    exec(success, error, "takephoto", "showPhotoPeview", [arg0]);
};
exports.loadPhoto = function(arg0, success, error) {
    exec(success, error, "takephoto", "loadPhoto", [arg0]);
};
exports.deleteAll = function(arg0, success, error) {
    exec(success, error, "takephoto", "deleteAll", [arg0]);
};

});
